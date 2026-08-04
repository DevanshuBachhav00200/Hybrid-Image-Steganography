"""
DCT Validator Sub-module.
Provides pre-condition, dimension, and 8x8 block grid integrity validation for DCT Steganography.
"""

from typing import Dict, Any, Optional
from app.steganography.dct.capacity import DCTCapacityCalculator
from app.core.exceptions import ValidationException


class DCTValidator:
    """
    DCT Validator component for verifying 8x8 block alignment, dimension requirements,
    and frequency domain embedding preconditions.
    """

    def __init__(self, capacity_calculator: Optional[DCTCapacityCalculator] = None):
        self.capacity_calculator = capacity_calculator or DCTCapacityCalculator()

    def validate_preconditions(
        self, cover_image_bytes: bytes, payload_bits: int, options: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Validate cover image format, 8x8 grid alignment, and DCT capacity limits.
        """
        options = options or {}
        cpb = options.get("coefficients_per_block", 1)
        reserved_bits = options.get("header_reserved_bits", 256)

        return self.capacity_calculator.validate_capacity(
            cover_image_bytes,
            payload_bits,
            coefficients_per_block=cpb,
            header_reserved_bits=reserved_bits,
            raise_exception=True,
        )
