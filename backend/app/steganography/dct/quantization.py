"""
Quantization Table Sub-module.
Provides standard JPEG luminance/chrominance 8x8 quantization tables and scaling functions.
"""

import numpy as np
from app.core.exceptions import QuantizationException

# Standard JPEG 50% Quality Luminance Quantization Table (8x8)
STANDARD_LUMINANCE_QUANTIZATION_TABLE = np.array([
    [16, 11, 10, 16,  24,  40,  51,  61],
    [12, 12, 14, 19,  26,  58,  60,  55],
    [14, 13, 16, 24,  40,  57,  69,  56],
    [14, 17, 22, 29,  51,  87,  80,  62],
    [18, 22, 37, 56,  68, 109, 103,  77],
    [24, 35, 55, 64,  81, 104, 113,  92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103,  99],
], dtype=np.float64)

# Standard JPEG 50% Quality Chrominance Quantization Table (8x8)
STANDARD_CHROMINANCE_QUANTIZATION_TABLE = np.array([
    [17, 18, 24, 47, 99, 99, 99, 99],
    [18, 21, 26, 66, 99, 99, 99, 99],
    [24, 26, 56, 99, 99, 99, 99, 99],
    [47, 66, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
], dtype=np.float64)


class QuantizationTable:
    """
    Quantization Table provider for JPEG luminance and chrominance quantization matrices.
    """

    @staticmethod
    def get_luminance_table(quality: int = 50) -> np.ndarray:
        """
        Get scaled 8x8 luminance quantization matrix for specified quality factor (1-100).
        """
        return QuantizationTable.scale_table(STANDARD_LUMINANCE_QUANTIZATION_TABLE, quality)

    @staticmethod
    def get_chrominance_table(quality: int = 50) -> np.ndarray:
        """
        Get scaled 8x8 chrominance quantization matrix for specified quality factor (1-100).
        """
        return QuantizationTable.scale_table(STANDARD_CHROMINANCE_QUANTIZATION_TABLE, quality)

    @staticmethod
    def scale_table(base_table: np.ndarray, quality: int) -> np.ndarray:
        """
        Scale standard 8x8 quantization table based on JPEG quality factor (1-100).
        """
        if quality < 1 or quality > 100:
            raise QuantizationException(f"Quality factor ({quality}) must be between 1 and 100.")

        if quality < 50:
            scale = 5000 / quality
        else:
            scale = 200 - (quality * 2)

        scaled_table = np.floor((base_table * scale + 50) / 100)
        scaled_table[scaled_table < 1] = 1
        scaled_table[scaled_table > 255] = 255
        return scaled_table.astype(np.float64)
