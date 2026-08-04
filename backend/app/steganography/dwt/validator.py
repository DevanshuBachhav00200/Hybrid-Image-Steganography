"""
DWT Precondition and Integrity Validator Sub-module (Phase 4C.2).
Validates image dimensions, formats, wavelet family parameter compatibility, and capacity constraints.
"""

import logging
from typing import Tuple, Dict, Any, Union
from PIL import Image

from app.core.exceptions import (
    ValidationException,
    UnsupportedFormatException,
    InvalidImageException,
)
from app.steganography.dwt.utils import DWTUtils
from app.steganography.dwt.wavelet_selector import WaveletSelector

logger = logging.getLogger(__name__)

MIN_DWT_IMAGE_DIM = 8
SUPPORTED_DWT_FORMATS = ["PNG", "BMP"]
SUPPORTED_DWT_MODES = ["RGB", "RGBA", "L"]


class DWTValidator:
    """
    DWTValidator.
    Performs integrity, boundary, and wavelet filter checks.
    """

    def __init__(self, wavelet_selector: WaveletSelector = None):
        self.wavelet_selector = wavelet_selector or WaveletSelector()

    def validate_preconditions(
        self,
        image_input: Union[bytes, Image.Image],
        wavelet_name: str = "haar",
        decomposition_level: int = 1,
    ) -> Tuple[str, Tuple[int, int], str]:
        """
        Validate image and transform parameters.

        :param image_input: Image bytes or PIL Image.
        :param wavelet_name: Configured wavelet.
        :param decomposition_level: Configured decomposition level.
        :return: Tuple of (format_str, dimensions_tuple, color_mode_str).
        :raises ValidationException: For invalid parameters.
        :raises UnsupportedFormatException: For unsupported image types.
        :raises InvalidImageException: For corrupted images.
        """
        # 1. Load image and retrieve specs
        try:
            _, fmt, (w, h), mode = DWTUtils.load_image_to_numpy(image_input)
        except InvalidImageException as exc:
            logger.error(f"DWTValidator: Image load failure: {str(exc)}")
            raise
        except Exception as exc:
            logger.error(f"DWTValidator: Unexpected loading error: {str(exc)}")
            raise InvalidImageException(f"Image loading failed: {str(exc)}")

        # 2. Format checks
        if fmt not in SUPPORTED_DWT_FORMATS:
            logger.warning(f"DWTValidator: Rejected format {fmt}.")
            raise UnsupportedFormatException(
                f"Format '{fmt}' is not supported. DWT steganography requires one of {SUPPORTED_DWT_FORMATS}."
            )

        # 3. Mode checks
        if mode not in SUPPORTED_DWT_MODES:
            logger.warning(f"DWTValidator: Rejected color mode {mode}.")
            raise UnsupportedFormatException(
                f"Color mode '{mode}' is not supported. DWT steganography requires one of {SUPPORTED_DWT_MODES}."
            )

        # 4. Dimension checks
        if w < MIN_DWT_IMAGE_DIM or h < MIN_DWT_IMAGE_DIM:
            logger.warning(f"DWTValidator: Image dimensions {w}x{h} are below minimum {MIN_DWT_IMAGE_DIM}x{MIN_DWT_IMAGE_DIM}.")
            raise InvalidImageException(
                f"Image dimensions {w}x{h} are below minimum DWT threshold ({MIN_DWT_IMAGE_DIM}x{MIN_DWT_IMAGE_DIM})."
            )

        # 5. Decomposition level checks
        if decomposition_level <= 0:
            raise ValidationException(f"Decomposition level ({decomposition_level}) must be positive.")

        max_allowed_level = 0
        min_dim = min(w, h)
        while min_dim >= 2:
            min_dim //= 2
            max_allowed_level += 1

        if decomposition_level > max_allowed_level:
            err_msg = (
                f"Decomposition level {decomposition_level} is too high for image dimensions {w}x{h}. "
                f"Maximum allowed level for this size is {max_allowed_level}."
            )
            logger.error(f"DWTValidator: {err_msg}")
            raise ValidationException(err_msg)

        # 6. Wavelet Selector checks
        # Will raise WaveletTransformException if invalid
        self.wavelet_selector.get_wavelet(wavelet_name)

        return fmt, (w, h), mode
