"""
LSB Bit Utilities Sub-module (Architecture Component).
Pure helper functions for LSB bitwise operations.
"""


class LSBUtils:
    """
    Utility class for low-level bit manipulation.
    """

    @staticmethod
    def set_lsb(pixel_value: int, bit_value: int) -> int:
        """Set the least significant bit of pixel_value to bit_value (0 or 1)."""
        return (pixel_value & ~1) | (bit_value & 1)

    @staticmethod
    def get_lsb(pixel_value: int) -> int:
        """Extract the least significant bit of pixel_value."""
        return pixel_value & 1
