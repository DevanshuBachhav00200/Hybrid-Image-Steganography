"""
LSB Bit Utilities Sub-module.
Provides pure helper functions for LSB bitwise operations, bit conversions, and quality metrics (PSNR, MSE).
"""

import io
import math
import numpy as np
from PIL import Image


class LSBUtils:
    """
    Utility class for low-level bit manipulation and steganographic image quality metrics.
    """

    @staticmethod
    def set_lsb(pixel_value: int, bit_value: int) -> int:
        """Set the least significant bit of pixel_value to bit_value (0 or 1)."""
        return (pixel_value & ~1) | (bit_value & 1)

    @staticmethod
    def get_lsb(pixel_value: int) -> int:
        """Extract the least significant bit of pixel_value."""
        return pixel_value & 1

    @staticmethod
    def calculate_mse(original_bytes: bytes, stego_bytes: bytes) -> float:
        """
        Calculate Mean Squared Error (MSE) between original cover image and stego image.
        """
        img1 = Image.open(io.BytesIO(original_bytes))
        img2 = Image.open(io.BytesIO(stego_bytes))

        arr1 = np.array(img1, dtype=np.float64)
        arr2 = np.array(img2, dtype=np.float64)

        if arr1.shape != arr2.shape:
            raise ValueError(f"Image shape mismatch: {arr1.shape} vs {arr2.shape}")

        mse = float(np.mean((arr1 - arr2) ** 2))
        return mse

    @staticmethod
    def calculate_psnr(original_bytes: bytes, stego_bytes: bytes) -> float:
        """
        Calculate Peak Signal-to-Noise Ratio (PSNR) in dB between original cover and stego images.
        """
        mse = LSBUtils.calculate_mse(original_bytes, stego_bytes)
        if mse == 0:
            return float("inf")  # Identical images have infinite PSNR

        max_pixel = 255.0
        psnr = 20.0 * math.log10(max_pixel / math.sqrt(mse))
        return round(psnr, 2)
