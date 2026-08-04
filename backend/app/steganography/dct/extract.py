"""
DCT Extraction Engine Sub-module (Phase 4B.4).
Provides production-ready frequency domain steganographic extraction from 8x8 DCT mid-frequency coefficient matrices
using 128-bit header validation and early termination payload bit recovery.
"""

import time
import logging
from typing import Dict, Any, Union, Optional
import numpy as np
from PIL import Image

from app.core.exceptions import (
    ExtractionException,
    NoHiddenDataException,
    CorruptedHeaderException,
    IncompletePayloadException,
)
from app.models.stego import DCTExtractionResult
from app.processing.binary.service import parse_header
from app.processing.binary.exceptions import InvalidHeaderException, PayloadLengthException
from app.processing.binary.bitstream import bits_to_bytes

from app.steganography.dct.capacity import DCTCapacityCalculator
from app.steganography.dct.transform import DCTTransformer
from app.steganography.dct.coefficient_selector import MidFrequencySelector
from app.steganography.dct.validator import DCTValidator
from app.steganography.dct.embed import DEFAULT_DCT_QUANTIZATION_STEP

logger = logging.getLogger(__name__)

HEADER_BITS_LEN = 128


class DCTExtractor:
    """
    DCT Extraction Engine.
    Recovers hidden binary payload bitstreams from 8x8 DCT mid-frequency coefficients
    with 128-bit header verification and early termination payload extraction.
    """

    def __init__(
        self,
        capacity_calculator: Optional[DCTCapacityCalculator] = None,
        transformer: Optional[DCTTransformer] = None,
        selector: Optional[MidFrequencySelector] = None,
        validator: Optional[DCTValidator] = None,
    ):
        """
        Initialize DCT Extractor with sub-module dependencies.
        """
        self.capacity_calculator = capacity_calculator or DCTCapacityCalculator()
        self.transformer = transformer or DCTTransformer()
        self.selector = selector or MidFrequencySelector()
        self.validator = validator or DCTValidator(self.capacity_calculator)

    def extract(
        self,
        stego_image_input: Union[bytes, Image.Image],
        options: Optional[Dict[str, Any]] = None,
    ) -> DCTExtractionResult:
        """
        Extract hidden binary payload bitstream from stego image DCT mid-frequency coefficients.

        :param stego_image_input: Stego image raw bytes or PIL Image object.
        :param options: Extraction options (quantization_step, coefficients_per_block).
        :return: DCTExtractionResult containing recovered binary bitstream and header metadata.
        :raises NoHiddenDataException: If valid steganography magic header ('STEGO') is missing.
        :raises CorruptedHeaderException: If header version, algorithm ID, or length is invalid.
        :raises IncompletePayloadException: If payload extends beyond stego image coefficient count.
        :raises ExtractionException: For general extraction failures.
        """
        start_time = time.perf_counter()
        options = options or {}

        quantization_step = float(options.get("quantization_step", DEFAULT_DCT_QUANTIZATION_STEP))
        coefficients_per_block = int(options.get("coefficients_per_block", 1))

        if quantization_step <= 0:
            raise ExtractionException(f"Invalid quantization step ({quantization_step}). Must be positive.")

        # Step 1: Forward 2D-DCT Transform of Stego Image
        coeff_dict, transform_meta = self.transformer.transform_image(stego_image_input)

        # Step 2: Retrieve target mid-frequency coordinates
        coords = self.selector.get_selected_coordinates(count=coefficients_per_block)

        channels = transform_meta.channels
        blocks_y, blocks_x, _, _ = transform_meta.blocks_shape
        total_blocks = blocks_y * blocks_x * channels

        # Generator for sequential bit reading across blocks and channels
        def coefficient_bit_stream():
            for c in range(channels):
                coeff_blocks = coeff_dict[c]
                for by in range(blocks_y):
                    for bx in range(blocks_x):
                        for (u, v) in coords:
                            coeff_val = coeff_blocks[by, bx, u, v]
                            k = int(np.round(coeff_val / quantization_step))
                            bit = str(k % 2)
                            yield bit

        bit_gen = coefficient_bit_stream()

        # Step 3: Extract First 128 Bits (Header)
        header_bits_list = []
        for _ in range(HEADER_BITS_LEN):
            try:
                header_bits_list.append(next(bit_gen))
            except StopIteration:
                raise ExtractionException(
                    f"Stego image total coefficients are smaller than required 128-bit header size."
                )

        header_bits_str = "".join(header_bits_list)
        header_bytes = bits_to_bytes(header_bits_str)

        # Step 4: Parse & Validate Embedded Header
        try:
            header_model = parse_header(header_bytes)
        except InvalidHeaderException as exc:
            err_msg = str(exc)
            if "magic bytes" in err_msg.lower():
                logger.warning("DCTExtractor: No valid steganography magic header ('STEGO') found.")
                raise NoHiddenDataException("No valid steganography magic header ('STEGO') found in DCT coefficients.")
            logger.warning(f"DCTExtractor: Header validation failed: {err_msg}")
            raise CorruptedHeaderException(f"DCT Stego header corrupted: {err_msg}")
        except PayloadLengthException as exc:
            raise CorruptedHeaderException(f"DCT Stego header payload length invalid: {str(exc)}")
        except Exception as exc:
            raise ExtractionException(f"Failed to parse DCT header: {str(exc)}")

        payload_bytes_len = header_model.payload_length
        total_required_bits = (16 + payload_bytes_len) * 8

        logger.info(
            f"DCTExtractor: Valid header ('STEGO') parsed | Version: {header_model.version} | "
            f"Payload Length: {payload_bytes_len} bytes ({total_required_bits} bits)"
        )

        # Step 5: Extract Remaining Payload Bits with Early Termination
        remaining_bits_to_read = total_required_bits - HEADER_BITS_LEN
        payload_bits_list = list(header_bits_list)

        for _ in range(remaining_bits_to_read):
            try:
                payload_bits_list.append(next(bit_gen))
            except StopIteration:
                raise IncompletePayloadException(
                    f"Required payload length ({total_required_bits} bits) extends beyond available image DCT coefficients."
                )

        recovered_bitstream = "".join(payload_bits_list)
        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        result_model = DCTExtractionResult(
            recovered_payload=recovered_bitstream,
            payload_size_bits=len(recovered_bitstream),
            payload_size_bytes=len(recovered_bitstream) // 8,
            header_info=header_model.model_dump(),
            coefficients_read=len(recovered_bitstream),
            total_blocks_scanned=total_blocks,
            quantization_step=quantization_step,
            extraction_time_ms=execution_time_ms,
            success=True,
            image_metadata={
                "width": transform_meta.image_width,
                "height": transform_meta.image_height,
                "color_mode": transform_meta.color_mode,
                "format": transform_meta.format,
            },
        )

        logger.info(
            f"DCTExtractor: Successfully extracted {len(recovered_bitstream)} bits in {execution_time_ms}ms "
            f"(Early Termination: Read {len(recovered_bitstream)}/{total_blocks * len(coords)} coefficients)."
        )

        return result_model
