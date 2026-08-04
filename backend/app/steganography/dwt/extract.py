"""
DWT Extraction Engine Sub-module (Phase 4C.4).
Provides production-ready data extraction from Discrete Wavelet Transform coefficients using parity quantization and header length parsing.
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
from app.models.stego import DWTExtractionResult
from app.processing.binary.service import parse_header
from app.processing.binary.exceptions import InvalidHeaderException, PayloadLengthException
from app.processing.binary.bitstream import bits_to_bytes
from app.steganography.dwt.capacity import DWTCapacityCalculator
from app.steganography.dwt.transform import DWTTransformer
from app.steganography.dwt.subband_selector import SubbandSelector
from app.steganography.dwt.validator import DWTValidator
from app.steganography.dwt.embed import DEFAULT_DWT_QUANTIZATION_STEP

logger = logging.getLogger(__name__)

HEADER_BITS_LEN = 128


class DWTExtractor:
    """
    DWTExtractor.
    Extracts hidden binary payloads from DWT detail sub-band coefficients via Parity Quantization.
    """

    def __init__(
        self,
        capacity_calculator: Optional[DWTCapacityCalculator] = None,
        transformer: Optional[DWTTransformer] = None,
        subband_selector: Optional[SubbandSelector] = None,
        validator: Optional[DWTValidator] = None,
    ):
        self.capacity_calculator = capacity_calculator or DWTCapacityCalculator()
        self.transformer = transformer or DWTTransformer()
        self.subband_selector = subband_selector or SubbandSelector()
        self.validator = validator or DWTValidator()

    def extract(
        self,
        stego_image_input: Union[bytes, Image.Image],
        options: Optional[Dict[str, Any]] = None,
    ) -> DWTExtractionResult:
        """
        Extract hidden binary payload bitstream from stego image DWT coefficients.

        :param stego_image_input: Stego image raw bytes or PIL Image object.
        :param options: Config dict (wavelet_family, decomposition_level, selected_subbands, quantization_step).
        :return: DWTExtractionResult structure.
        :raises NoHiddenDataException: If steganography magic header ('STEGO') is missing.
        :raises CorruptedHeaderException: If header version, length, or metadata is invalid.
        :raises IncompletePayloadException: If payload length extends beyond available coefficients.
        :raises ExtractionException: For general extraction failures.
        """
        start_time = time.perf_counter()
        options = options or {}

        wavelet_family = str(options.get("wavelet_family", "haar"))
        decomposition_level = int(options.get("decomposition_level", 1))
        selected_subbands = list(options.get("selected_subbands", ["LH", "HL"]))
        quantization_step = float(options.get("quantization_step", DEFAULT_DWT_QUANTIZATION_STEP))

        if quantization_step <= 0:
            raise ExtractionException(f"Invalid quantization step ({quantization_step}). Must be positive.")

        # 1. Forward 2D-DWT Transform of Stego Image
        try:
            coeffs_dict, transform_meta = self.transformer.transform_image(stego_image_input, options=options)
        except Exception as exc:
            raise ExtractionException(f"Forward DWT transform failed: {str(exc)}")

        img_meta = transform_meta.image_metadata
        channels = len(coeffs_dict)

        # Retrieve coefficient matrices for selected subbands
        target_matrices: List[np.ndarray] = []
        total_coefficients = 0
        for ch_idx in range(channels):
            for sb_name in selected_subbands:
                matrix = self.subband_selector.extract_subband_coefficients(
                    coeffs_dict[ch_idx], sb_name, level=decomposition_level
                )
                target_matrices.append(matrix)
                total_coefficients += matrix.size

        # Generator to yield bits sequentially from selected subbands
        def coefficient_bit_stream():
            for matrix in target_matrices:
                h, w = matrix.shape
                for y in range(h):
                    for x in range(w):
                        val = float(matrix[y, x])
                        k = int(np.round(val / quantization_step))
                        bit = str(k % 2)
                        yield bit

        bit_gen = coefficient_bit_stream()

        # 2. Extract First 128 Bits (Header)
        header_bits_list = []
        for _ in range(HEADER_BITS_LEN):
            try:
                header_bits_list.append(next(bit_gen))
            except StopIteration:
                raise ExtractionException(
                    f"Stego image total coefficients ({total_coefficients}) are smaller than required 128-bit header size."
                )

        header_bits_str = "".join(header_bits_list)
        header_bytes = bits_to_bytes(header_bits_str)

        # 3. Parse & Validate Embedded Header
        try:
            header_model = parse_header(header_bytes)
        except InvalidHeaderException as exc:
            err_msg = str(exc)
            if "magic bytes" in err_msg.lower():
                logger.warning("DWTExtractor: No valid steganography magic header ('STEGO') found.")
                raise NoHiddenDataException("No valid steganography magic header ('STEGO') found in DWT coefficients.")
            logger.warning(f"DWTExtractor: Header validation failed: {err_msg}")
            raise CorruptedHeaderException(f"DWT Stego header corrupted: {err_msg}")
        except PayloadLengthException as exc:
            raise CorruptedHeaderException(f"DWT Stego header payload length invalid: {str(exc)}")
        except Exception as exc:
            raise ExtractionException(f"Failed to parse DWT header: {str(exc)}")

        payload_bytes_len = header_model.payload_length
        total_required_bits = (16 + payload_bytes_len) * 8

        logger.info(
            f"DWTExtractor: Valid header ('STEGO') parsed | Version: {header_model.version} | "
            f"Payload Length: {payload_bytes_len} bytes ({total_required_bits} bits)"
        )

        # 4. Extract Remaining Payload Bits with Early Termination
        remaining_bits_to_read = total_required_bits - HEADER_BITS_LEN
        payload_bits_list = list(header_bits_list)

        for _ in range(remaining_bits_to_read):
            try:
                payload_bits_list.append(next(bit_gen))
            except StopIteration:
                raise IncompletePayloadException(
                    f"Required payload length ({total_required_bits} bits) extends beyond available DWT coefficients ({total_coefficients})."
                )

        recovered_bitstream = "".join(payload_bits_list)
        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        result_model = DWTExtractionResult(
            recovered_payload=recovered_bitstream,
            payload_size_bits=len(recovered_bitstream),
            payload_size_bytes=len(recovered_bitstream) // 8,
            header_info=header_model.model_dump(),
            coefficients_read=len(recovered_bitstream),
            total_coefficients=total_coefficients,
            wavelet_family=wavelet_family,
            decomposition_level=decomposition_level,
            selected_subbands=[s.upper() for s in selected_subbands],
            quantization_step=quantization_step,
            extraction_time_ms=execution_time_ms,
            success=True,
            image_metadata={
                "width": img_meta["width"],
                "height": img_meta["height"],
                "color_mode": img_meta["color_mode"],
                "format": img_meta["format"],
            },
        )

        logger.info(
            f"DWTExtractor: Successfully extracted {len(recovered_bitstream)} bits in {execution_time_ms}ms "
            f"(Early Termination: Read {len(recovered_bitstream)}/{total_coefficients} coefficients)."
        )

        return result_model
