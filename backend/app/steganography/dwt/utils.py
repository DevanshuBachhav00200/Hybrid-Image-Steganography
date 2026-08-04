"""
DWT Helper Utilities Sub-module (Phase 4C.2).
Provides image dimension edge padding, conversion and color mapping helper methods.
"""

import io
import logging
from typing import Tuple, Union
import numpy as np
from PIL import Image

from app.core.exceptions import PaddingException, InvalidImageException

logger = logging.getLogger(__name__)


class DWTUtils:
    """
    DWTUtils.
    Provides edge padding, channel formatting, and reconstruction conversion routines.
    """

    @staticmethod
    def pad_image_channel(channel: np.ndarray, level: int) -> Tuple[np.ndarray, Tuple[int, int]]:
        """
        Pad image channel with edge repetition to ensure shape is divisible by 2^level.

        :param channel: 2D numpy array representing a single channel.
        :param level: Decomposition level.
        :return: Tuple of (padded_channel, (pad_y, pad_x)).
        :raises PaddingException: If padding fails or dimensions are invalid.
        """
        if channel.ndim != 2:
            raise PaddingException(f"Expected 2D array for channel, got shape {channel.shape}.")

        h, w = channel.shape
        factor = 2 ** level

        pad_y = (factor - (h % factor)) % factor
        pad_x = (factor - (w % factor)) % factor

        if pad_y == 0 and pad_x == 0:
            return channel.copy(), (0, 0)

        try:
            # Symmetric or edge padding is preferred for wavelets to reduce boundary artifacts
            padded = np.pad(channel, ((0, pad_y), (0, pad_x)), mode="edge")
            return padded, (pad_y, pad_x)
        except Exception as exc:
            raise PaddingException(f"Failed to pad image channel: {str(exc)}")

    @staticmethod
    def unpad_image_channel(padded_channel: np.ndarray, original_shape: Tuple[int, int]) -> np.ndarray:
        """
        Crop padded image channel back to its original dimensions.

        :param padded_channel: Padded 2D channel array.
        :param original_shape: Tuple of (original_height, original_width).
        :return: Cropped 2D numpy array.
        :raises PaddingException: If cropping bounds are invalid.
        """
        if padded_channel.ndim != 2:
            raise PaddingException(f"Expected 2D array, got shape {padded_channel.shape}.")

        orig_h, orig_w = original_shape
        pad_h, pad_w = padded_channel.shape

        if orig_h > pad_h or orig_w > pad_w:
            raise PaddingException(
                f"Original shape {original_shape} exceeds padded dimensions {padded_channel.shape}."
            )

        return padded_channel[0:orig_h, 0:orig_w].copy()

    @staticmethod
    def load_image_to_numpy(image_input: Union[bytes, Image.Image]) -> Tuple[np.ndarray, str, Tuple[int, int], str]:
        """
        Validate and load PIL image/bytes to numpy array, extracting metadata.

        :param image_input: Image bytes or PIL Image object.
        :return: Tuple of (numpy_array, format_str, dimensions_tuple, color_mode_str).
        :raises InvalidImageException: If the image cannot be loaded.
        """
        try:
            if isinstance(image_input, bytes):
                img = Image.open(io.BytesIO(image_input))
            elif isinstance(image_input, Image.Image):
                img = image_input
            else:
                raise InvalidImageException("Unsupported image input type. Expected bytes or PIL Image.")

            # Load actual pixels
            img.load()
            fmt = (img.format or "PNG").upper()
            mode = img.mode
            dims = img.size  # (width, height)

            arr = np.array(img)
            return arr, fmt, dims, mode
        except InvalidImageException:
            raise
        except Exception as exc:
            raise InvalidImageException(f"Failed to load image input: {str(exc)}")
