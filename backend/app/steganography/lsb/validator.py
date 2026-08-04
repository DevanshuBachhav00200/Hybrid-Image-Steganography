"""
LSB Validator Sub-module (Architecture Component).
Implementation scheduled for Phase 4A.5.
"""

from typing import Dict, Any, Union
from app.steganography.lsb.capacity import LSBCapacityCalculator


class LSBValidator:
    """
    LSB Validator component for checking steganographic pre-conditions and post-conditions.
    """

    def __init__(self, capacity_calculator: LSBCapacityCalculator = None):
        self.capacity_calculator = capacity_calculator or LSBCapacityCalculator()

    def validate_preconditions(self, cover_image_bytes: bytes, payload_bits: int, options: Dict[str, Any] = None) -> bool:
        """
        Validate image format, dimensions, and capacity limits.
        """
        return self.capacity_calculator.validate_capacity(cover_image_bytes, payload_bits)
