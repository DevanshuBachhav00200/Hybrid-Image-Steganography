"""
DWT Transform Engine Sub-module (Phase 4C.2).
Handles loaded and padded cover image numeric conversions, forward multi-level 2D-DWT, and coefficient structures.
"""

import time
import logging
from typing import Dict, Any, Union, Tuple, List, Optional
import numpy as np
from PIL import Image
import pywt

from app.core.exceptions import WaveletTransformException, InvalidImageException
from app.models.stego import DWTTransformResult
from app.steganography.dwt.utils import DWTUtils
from app.steganography.dwt.wavelet_selector import WaveletSelector
from app.steganography.dwt.validator import DWTValidator

logger = logging.getLogger(__name__)


class DWTTransformer:
    """
    DWTTransformer.
    Executes Forward 2D Discrete Wavelet Transform decomposition on single or multi-channel spatial images.
    """

    def __init__(
        self,
        wavelet_selector: Optional[WaveletSelector] = None,
        validator: Optional[DWTValidator] = None,
    ):
        self.wavelet_selector = wavelet_selector or WaveletSelector()
        self.validator = validator or DWTValidator(self.wavelet_selector)

    def transform_image(
        self,
        image_input: Union[bytes, Image.Image],
        options: Optional[Dict[str, Any]] = None,
    ) -> Tuple[Dict[int, List[Any]], DWTTransformResult]:
        """
        Decompose Cover Image into multi-level DWT sub-band coefficients for each channel.

        :param image_input: Image bytes or PIL Image object.
        :param options: Config dict (wavelet_family, decomposition_level).
        :return: Tuple of (coefficients_dict, DWTTransformResult).
        :raises WaveletTransformException: If decomposition fails or parameters are invalid.
        """
        start_time = time.perf_counter()
        options = options or {}

        wavelet_family = str(options.get("wavelet_family", "haar"))
        decomposition_level = int(options.get("decomposition_level", 1))

        # 1. Precondition Validation
        try:
            fmt, (w, h), mode = self.validator.validate_preconditions(
                image_input, wavelet_family, decomposition_level
            )
        except Exception as exc:
            logger.error(f"DWTTransformer: Precondition validation failed: {str(exc)}")
            raise WaveletTransformException(f"Precondition validation failed: {str(exc)}")

        # 2. Get PyWavelets wavelet object
        wavelet_obj = self.wavelet_selector.get_wavelet(wavelet_family)

        # 3. Load image pixels to numpy
        try:
            arr, _, _, _ = DWTUtils.load_image_to_numpy(image_input)
        except Exception as exc:
            raise WaveletTransformException(f"Failed to read image pixels: {str(exc)}")

        # 4. Handle color channels
        # Grayscale mode shape is (H, W), RGB shape is (H, W, 3), RGBA shape is (H, W, 4)
        if arr.ndim == 2:
            channels_list = [arr]
        elif arr.ndim == 3:
            channels_list = [arr[:, :, i] for i in range(arr.shape[2])]
        else:
            raise WaveletTransformException(f"Unsupported image array dimension layout: {arr.shape}.")

        coeffs_dict: Dict[int, List[Any]] = {}
        subbands_info: Dict[str, Any] = {}
        padding_meta: Dict[int, Tuple[int, int]] = {}

        # 5. Perform Forward 2D-DWT Decomposition on each channel
        try:
            for ch_idx, channel_data in enumerate(channels_list):
                # Apply symmetric edge padding
                padded_channel, (pad_y, pad_x) = DWTUtils.pad_image_channel(channel_data, decomposition_level)
                padding_meta[ch_idx] = (pad_y, pad_x)

                # Wavedec2 multi-level decomposition
                # Returns [cAn, (cHn, cVn, cDn), ..., (cH1, cV1, cD1)]
                coeffs = pywt.wavedec2(padded_channel, wavelet=wavelet_obj, level=decomposition_level)
                coeffs_dict[ch_idx] = coeffs

                # Record subband sizes and parameters on first channel
                if ch_idx == 0:
                    cAn = coeffs[0]
                    subbands_info["LL_shape"] = cAn.shape
                    details_info = []
                    for lvl in range(1, decomposition_level + 1):
                        list_idx = decomposition_level - lvl + 1
                        cH, cV, cD = coeffs[list_idx]
                        details_info.append({
                            "level": lvl,
                            "HL_shape": cH.shape,
                            "LH_shape": cV.shape,
                            "HH_shape": cD.shape
                        })
                    subbands_info["details"] = details_info
        except Exception as exc:
            logger.error(f"DWTTransformer: 2D-DWT decomposition failed: {str(exc)}")
            raise WaveletTransformException(f"2D-DWT transformation failed: {str(exc)}")

        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        result_model = DWTTransformResult(
            wavelet_family=wavelet_family,
            decomposition_level=decomposition_level,
            subbands_info=subbands_info,
            transform_execution_time_ms=execution_time_ms,
            validation_status=True,
            image_metadata={
                "width": w,
                "height": h,
                "format": fmt,
                "color_mode": mode,
                "padding_info": padding_meta,
            }
        )

        logger.info(
            f"DWTTransformer: Successfully transformed {w}x{h} ({mode}) image using '{wavelet_family}' "
            f"wavelet at level {decomposition_level} in {execution_time_ms}ms."
        )

        return coeffs_dict, result_model
