"""
DWT Embedding Engine Sub-module (Phase 4C.3).
Provides production-ready data embedding in Discrete Wavelet Transform coefficients using parity quantization.
"""

import time
import logging
from typing import Dict, Any, Union, Tuple, List, Optional
import numpy as np
from PIL import Image

from app.core.exceptions import (
    EmbeddingException,
    PayloadTooLargeException,
    CapacityCalculationException,
)
from app.models.stego import DWTEmbeddingResult
from app.steganography.lsb.utils import LSBUtils
from app.steganography.dwt.capacity import DWTCapacityCalculator
from app.steganography.dwt.transform import DWTTransformer
from app.steganography.dwt.reconstruction import DWTReconstructor
from app.steganography.dwt.subband_selector import SubbandSelector
from app.steganography.dwt.validator import DWTValidator

logger = logging.getLogger(__name__)

DEFAULT_DWT_QUANTIZATION_STEP = 16.0


class DWTEmbedder:
    """
    DWTEmbedder.
    Embeds binary payload bitstreams into target 2D-DWT detail sub-band coefficients via Parity Quantization.
    """

    def __init__(
        self,
        capacity_calculator: Optional[DWTCapacityCalculator] = None,
        transformer: Optional[DWTTransformer] = None,
        reconstructor: Optional[DWTReconstructor] = None,
        subband_selector: Optional[SubbandSelector] = None,
        validator: Optional[DWTValidator] = None,
    ):
        self.capacity_calculator = capacity_calculator or DWTCapacityCalculator()
        self.transformer = transformer or DWTTransformer()
        self.reconstructor = reconstructor or DWTReconstructor()
        self.subband_selector = subband_selector or SubbandSelector()
        self.validator = validator or DWTValidator()

    def embed(
        self,
        cover_image_bytes: bytes,
        payload_data: Any,
        options: Optional[Dict[str, Any]] = None,
    ) -> DWTEmbeddingResult:
        """
        Embed binary payload into cover image DWT coefficients.

        :param cover_image_bytes: Raw bytes of the cover image.
        :param payload_data: Binary bitstream string ("0101...") or Payload model.
        :param options: Execution parameters (wavelet_family, decomposition_level, selected_subbands, quantization_step).
        :return: DWTEmbeddingResult structure.
        :raises PayloadTooLargeException: If payload size exceeds usable capacity.
        :raises EmbeddingException: For general embedding failures.
        """
        start_time = time.perf_counter()
        options = options or {}

        wavelet_family = str(options.get("wavelet_family", "haar"))
        decomposition_level = int(options.get("decomposition_level", 1))
        selected_subbands = list(options.get("selected_subbands", ["LH", "HL"]))
        quantization_step = float(options.get("quantization_step", DEFAULT_DWT_QUANTIZATION_STEP))

        if quantization_step <= 0:
            raise EmbeddingException(f"Invalid quantization step ({quantization_step}). Must be positive.")

        # 1. Parse payload bitstream
        if hasattr(payload_data, "binary_data"):
            bitstream = payload_data.binary_data
        elif hasattr(payload_data, "binary_bitstream"):
            bitstream = payload_data.binary_bitstream
        elif isinstance(payload_data, str):
            bitstream = payload_data
        else:
            raise EmbeddingException("Invalid payload format. Expected binary bitstream string or Payload model.")


        if not bitstream or not all(c in "01" for c in bitstream):
            raise EmbeddingException("Payload bitstream contains invalid characters. Must contain only '0' and '1'.")

        payload_bits = len(bitstream)

        # 2. Check and Validate Capacity
        try:
            # Performs precondition check under the hood and raises PayloadTooLargeException if exceeding
            self.capacity_calculator.validate_capacity(
                cover_image_bytes,
                payload_bits,
                options=options,
                raise_exception=True,
            )
        except PayloadTooLargeException:
            raise
        except Exception as exc:
            raise EmbeddingException(f"Embedding validation failed: {str(exc)}")

        # 3. Perform Forward 2D-DWT Transform
        try:
            coeffs_dict, transform_meta = self.transformer.transform_image(cover_image_bytes, options=options)
        except Exception as exc:
            raise EmbeddingException(f"Forward DWT transform failed: {str(exc)}")

        img_meta = transform_meta.image_metadata
        channels = len(coeffs_dict)
        total_coefficients = 0

        # We will retrieve copies of target subband matrices to embed bits sequentially
        # Structure we use: list of (channel_idx, subband_name, coefficient_matrix_reference)
        target_subbands_list: List[Tuple[int, str, np.ndarray]] = []
        for ch_idx in range(channels):
            for sb_name in selected_subbands:
                matrix = self.subband_selector.extract_subband_coefficients(
                    coeffs_dict[ch_idx], sb_name, level=decomposition_level
                )
                target_subbands_list.append((ch_idx, sb_name, matrix))
                total_coefficients += matrix.size

        # 4. Embed Bits into Target Coefficients via Parity Quantization
        bit_idx = 0
        coefficients_modified = 0
        
        # We will loop through the target subband matrices and modify coefficients sequentially
        for ch_idx, sb_name, matrix in target_subbands_list:
            if bit_idx >= payload_bits:
                break

            # Create a writeable copy to perform updates
            modified_matrix = matrix.copy()
            h, w = modified_matrix.shape

            for y in range(h):
                for x in range(w):
                    if bit_idx >= payload_bits:
                        break

                    val = float(modified_matrix[y, x])
                    bit = int(bitstream[bit_idx])

                    # Parity Quantization:
                    k = int(np.round(val / quantization_step))
                    
                    if k % 2 != bit:
                        # Adjust k to match bit parity while minimizing distortion
                        if val > k * quantization_step:
                            k += 1
                        else:
                            k -= 1

                    new_val = k * quantization_step
                    
                    if new_val != val:
                        modified_matrix[y, x] = new_val
                        coefficients_modified += 1

                    bit_idx += 1

            # Update modified matrix back into coeffs_dict structure
            coeffs_dict[ch_idx] = self.subband_selector.update_subband_coefficients(
                coeffs_dict[ch_idx], sb_name, level=decomposition_level, new_coeff_matrix=modified_matrix
            )

        # 5. Spatial Reconstruction via 2D Inverse Wavelet Transform
        try:
            stego_image_bytes = self.reconstructor.reconstruct_image(coeffs_dict, transform_meta)
        except Exception as exc:
            raise EmbeddingException(f"DWT Image reconstruction failed: {str(exc)}")

        # 6. Calculate Image Quality Metrics (PSNR & MSE)
        try:
            psnr_db = LSBUtils.calculate_psnr(cover_image_bytes, stego_image_bytes)
            mse = LSBUtils.calculate_mse(cover_image_bytes, stego_image_bytes)
        except Exception as exc:
            logger.warning(f"Failed to calculate image quality metrics: {str(exc)}")
            psnr_db = 0.0
            mse = 0.0

        # 7. Get capacity stats for response structured models
        stats = self.capacity_calculator.get_capacity_statistics(
            cover_image_bytes, payload_bits=payload_bits, options=options
        )

        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        result = DWTEmbeddingResult(
            stego_image_bytes=stego_image_bytes,
            payload_size_bits=payload_bits,
            payload_size_bytes=payload_bits // 8,
            usable_capacity_bits=stats.usable_capacity_bits,
            capacity_used_percentage=stats.capacity_used_percentage,
            remaining_capacity_bits=stats.remaining_capacity_bits,
            coefficients_modified=coefficients_modified,
            total_coefficients=total_coefficients,
            wavelet_family=wavelet_family,
            decomposition_level=decomposition_level,
            selected_subbands=[s.upper() for s in selected_subbands],
            psnr_db=psnr_db,
            mse=round(mse, 6),
            embedding_time_ms=execution_time_ms,
            format=img_meta["format"],
            color_mode=img_meta["color_mode"],
            dimensions=(img_meta["width"], img_meta["height"]),
            success=True,
        )

        logger.info(
            f"DWTEmbedder: Successfully embedded {payload_bits} bits in {execution_time_ms}ms "
            f"| PSNR: {psnr_db} dB | Modified: {coefficients_modified}/{total_coefficients} coeffs."
        )

        return result
