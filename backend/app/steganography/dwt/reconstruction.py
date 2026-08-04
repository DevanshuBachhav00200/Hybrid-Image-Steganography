"""
DWT Image Reconstruction Sub-module (Phase 4C.2).
Performs inverse multi-level 2D-IDWT, edge padding cropping, spatial scaling, range clipping and channel reassembly.
"""

import io
import time
import logging
from typing import Dict, Any, List, Optional
import numpy as np
from PIL import Image
import pywt

from app.core.exceptions import ReconstructionException
from app.models.stego import DWTTransformResult
from app.steganography.dwt.utils import DWTUtils
from app.steganography.dwt.wavelet_selector import WaveletSelector

logger = logging.getLogger(__name__)


class DWTReconstructor:
    """
    DWTReconstructor.
    Reconstructs spatial domain images from multi-channel DWT coefficient structures via 2D Inverse Wavelet Transform.
    """

    def __init__(self, wavelet_selector: Optional[WaveletSelector] = None):
        self.wavelet_selector = wavelet_selector or WaveletSelector()

    def reconstruct_image(
        self,
        coeffs_dict: Dict[int, List[Any]],
        transform_meta: DWTTransformResult,
    ) -> bytes:
        """
        Perform Inverse 2D-IDWT and reconstruct the spatial image bytes.

        :param coeffs_dict: Dict of channel indices mapping to their decomposed coefficients structure.
        :param transform_meta: DWTTransformResult containing wavelet, padding, and size metadata.
        :return: Reconstructed stego image bytes.
        :raises ReconstructionException: If reconstruction or file formatting fails.
        """
        start_time = time.perf_counter()

        wavelet_family = transform_meta.wavelet_family
        wavelet_obj = self.wavelet_selector.get_wavelet(wavelet_family)

        img_meta = transform_meta.image_metadata
        orig_w = img_meta["width"]
        orig_h = img_meta["height"]
        color_mode = img_meta["color_mode"]
        fmt = img_meta["format"]
        padding_info = img_meta["padding_info"]

        channels_count = len(coeffs_dict)
        reconstructed_channels: List[np.ndarray] = []

        try:
            # 1. Loop through each channel and apply Inverse 2D-IDWT
            for ch_idx in range(channels_count):
                coeffs_list = coeffs_dict[ch_idx]

                # Perform Inverse DWT
                padded_reconstructed = pywt.waverec2(coeffs_list, wavelet=wavelet_obj)

                # Crop padding back to original dimensions
                pad_y, pad_x = padding_info[ch_idx]
                cropped = DWTUtils.unpad_image_channel(padded_reconstructed, (orig_h, orig_w))

                # Clip float coefficients back to [0, 255] byte range and cast to uint8
                clipped = np.clip(np.round(cropped), 0, 255).astype(np.uint8)
                reconstructed_channels.append(clipped)

            # 2. Reassemble channels into original spatial layout
            if color_mode == "L":
                final_arr = reconstructed_channels[0]
            else:
                final_arr = np.stack(reconstructed_channels, axis=-1)

            # 3. Save PIL Image back to bytes
            img = Image.fromarray(final_arr, mode=color_mode)
            buf = io.BytesIO()
            img.save(buf, format=fmt)
            reconstructed_bytes = buf.getvalue()

        except Exception as exc:
            logger.error(f"DWTReconstructor: Inverse DWT reconstruction failed: {str(exc)}")
            raise ReconstructionException(f"DWT reconstruction failed: {str(exc)}")

        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)
        logger.info(
            f"DWTReconstructor: Successfully reconstructed image ({orig_w}x{orig_h}, {color_mode}) "
            f"in {execution_time_ms}ms."
        )

        return reconstructed_bytes
