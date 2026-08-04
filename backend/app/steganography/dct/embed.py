"""
DCT Embedding Engine Sub-module (Phase 4B.3).
Provides production-ready frequency domain steganographic embedding using 8x8 DCT mid-frequency coefficient parity quantization.
"""

import time
import logging
from typing import Dict, Any, Union, Optional
import numpy as np
from PIL import Image

from app.core.constants import DEFAULT_HEADER_RESERVATION_BITS
from app.core.exceptions import (
    EmbeddingException,
    PayloadTooLargeException,
    CoefficientSelectionException,
)
from app.processing.payload.models import Payload

from app.models.stego import DCTEmbeddingResult
from app.steganography.dct.capacity import DCTCapacityCalculator
from app.steganography.dct.transform import DCTTransformer
from app.steganography.dct.coefficient_selector import MidFrequencySelector
from app.steganography.dct.validator import DCTValidator
from app.steganography.lsb.utils import LSBUtils

logger = logging.getLogger(__name__)

# Default DCT Quantization Step for robust parity quantization
DEFAULT_DCT_QUANTIZATION_STEP = 16.0


class DCTEmbedder:
    """
    DCT Embedding Engine.
    Embeds binary payload bitstreams into 8x8 DCT mid-frequency coefficient matrices
    using orthogonal 2D-DCT transforms and robust parity quantization.
    """

    def __init__(
        self,
        capacity_calculator: Optional[DCTCapacityCalculator] = None,
        transformer: Optional[DCTTransformer] = None,
        selector: Optional[MidFrequencySelector] = None,
        validator: Optional[DCTValidator] = None,
    ):
        """
        Initialize DCT Embedder with sub-module dependencies.
        """
        self.capacity_calculator = capacity_calculator or DCTCapacityCalculator()
        self.transformer = transformer or DCTTransformer()
        self.selector = selector or MidFrequencySelector()
        self.validator = validator or DCTValidator(self.capacity_calculator)

    @staticmethod
    def _extract_payload_bitstream(payload_input: Union[str, Payload, bytes]) -> str:
        """
        Extract and validate raw binary bitstream string ('010110...') from payload input.
        """
        if payload_input is None:
            raise EmbeddingException("Payload input cannot be None.")

        if isinstance(payload_input, Payload):
            bitstream = payload_input.binary_data
        elif isinstance(payload_input, str):
            bitstream = payload_input
        elif isinstance(payload_input, bytes):
            try:
                bitstream = payload_input.decode("utf-8")
            except Exception as exc:
                raise EmbeddingException(f"Failed to decode byte payload to bitstream string: {str(exc)}")
        else:
            raise EmbeddingException(f"Unsupported payload input type '{type(payload_input).__name__}'.")

        if not bitstream or len(bitstream) == 0:
            raise EmbeddingException("Binary payload bitstream is empty (0 bits).")

        # Validate that bitstream consists strictly of '0' and '1' characters
        if not set(bitstream).issubset({"0", "1"}):
            raise EmbeddingException("Invalid binary payload format. Bitstream must contain only '0' and '1' characters.")

        return bitstream

    def embed(
        self,
        cover_image_input: Union[bytes, Image.Image],
        payload_input: Union[str, Payload, bytes],
        options: Optional[Dict[str, Any]] = None,
    ) -> DCTEmbeddingResult:
        """
        Embed binary payload bitstream into cover image DCT mid-frequency coefficients.

        :param cover_image_input: Cover image raw bytes or PIL Image object.
        :param payload_input: Binary bitstream string ("010110...") or Payload object.
        :param options: Embedding options (quantization_step, coefficients_per_block, header_reserved_bits).
        :return: DCTEmbeddingResult containing stego image bytes, PSNR metrics, and embedding statistics.
        """
        start_time = time.perf_counter()
        options = options or {}

        quantization_step = float(options.get("quantization_step", DEFAULT_DCT_QUANTIZATION_STEP))
        coefficients_per_block = int(options.get("coefficients_per_block", 1))
        header_reserved_bits = int(options.get("header_reserved_bits", DEFAULT_HEADER_RESERVATION_BITS))

        if quantization_step <= 0:
            raise EmbeddingException(f"Invalid quantization step ({quantization_step}). Must be positive.")

        # Step 1: Extract and validate payload bitstream
        bitstream = self._extract_payload_bitstream(payload_input)
        payload_bits_len = len(bitstream)

        # Step 2: Validate preconditions and capacity limits
        self.validator.validate_preconditions(
            cover_image_input,
            payload_bits_len,
            options={
                "coefficients_per_block": coefficients_per_block,
                "header_reserved_bits": header_reserved_bits,
            },
        )

        # Step 3: Forward 2D-DCT Transform
        coeff_dict, transform_meta = self.transformer.transform_image(cover_image_input)

        # Step 4: Retrieve target mid-frequency coordinates
        coords = self.selector.get_selected_coordinates(count=coefficients_per_block)

        # Step 5: Embed payload bits into DCT coefficients using Parity Quantization
        bit_idx = 0
        coefficients_modified = 0
        channels = transform_meta.channels
        blocks_y, blocks_x, _, _ = transform_meta.blocks_shape
        total_blocks = blocks_y * blocks_x * channels

        for c in range(channels):
            if bit_idx >= payload_bits_len:
                break
            coeff_blocks = coeff_dict[c]

            for by in range(blocks_y):
                if bit_idx >= payload_bits_len:
                    break

                for bx in range(blocks_x):
                    if bit_idx >= payload_bits_len:
                        break

                    for (u, v) in coords:
                        if bit_idx >= payload_bits_len:
                            break

                        target_bit = int(bitstream[bit_idx])
                        orig_val = coeff_blocks[by, bx, u, v]

                        # Parity Quantization: Round coefficient to quantization step Q
                        k = int(np.round(orig_val / quantization_step))
                        if k % 2 != target_bit:
                            if (orig_val / quantization_step) >= k:
                                k += 1
                            else:
                                k -= 1

                        new_val = k * quantization_step
                        if new_val != orig_val:
                            coeff_blocks[by, bx, u, v] = new_val
                            coefficients_modified += 1

                        bit_idx += 1

        if bit_idx < payload_bits_len:
            raise EmbeddingException(
                f"Embedding incomplete: Only embedded {bit_idx}/{payload_bits_len} bits."
            )

        # Step 6: Inverse 2D-IDCT & Image Reconstruction
        stego_image_bytes = self.transformer.reconstruct_image(coeff_dict, transform_meta)

        # Step 7: Compute Quality Metrics (PSNR & MSE)
        if isinstance(cover_image_input, bytes):
            orig_bytes = cover_image_input
        else:
            buf = io.BytesIO()
            cover_image_input.save(buf, format=transform_meta.format)
            orig_bytes = buf.getvalue()

        psnr_db = LSBUtils.calculate_psnr(orig_bytes, stego_image_bytes)
        mse = LSBUtils.calculate_mse(orig_bytes, stego_image_bytes)

        # Step 8: Calculate Capacity Metrics
        usable_capacity_bits = self.capacity_calculator.calculate_capacity(
            cover_image_input,
            coefficients_per_block=coefficients_per_block,
            header_reserved_bits=header_reserved_bits,
        )
        remaining_capacity_bits = max(0, usable_capacity_bits - payload_bits_len)
        capacity_used_pct = (
            round((payload_bits_len / usable_capacity_bits) * 100.0, 4)
            if usable_capacity_bits > 0
            else 0.0
        )
        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        result_model = DCTEmbeddingResult(
            stego_image_bytes=stego_image_bytes,
            payload_size_bits=payload_bits_len,
            payload_size_bytes=payload_bits_len // 8,
            usable_capacity_bits=usable_capacity_bits,
            capacity_used_percentage=capacity_used_pct,
            remaining_capacity_bits=remaining_capacity_bits,
            coefficients_modified=coefficients_modified,
            total_blocks_processed=total_blocks,
            coefficients_per_block=coefficients_per_block,
            quantization_step=quantization_step,
            psnr_db=psnr_db,
            mse=mse,
            embedding_time_ms=execution_time_ms,
            format=transform_meta.format,
            color_mode=transform_meta.color_mode,
            dimensions=(transform_meta.image_width, transform_meta.image_height),
            success=True,
        )

        logger.info(
            f"DCTEmbedder: Embedded {payload_bits_len} bits into {transform_meta.image_width}x{transform_meta.image_height} "
            f"({transform_meta.color_mode}) image | Coeffs modified: {coefficients_modified} | PSNR: {psnr_db} dB | "
            f"Time: {execution_time_ms}ms"
        )

        return result_model
