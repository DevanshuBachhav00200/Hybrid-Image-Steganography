"""
DWT Steganographic Capacity Calculator Sub-module (Phase 4C.2).
Computes usable embedding coefficients, reserved header space, and payload limits under DWT decomposition.
"""

import logging
from typing import Dict, Any, Union, Tuple, List, Optional
from PIL import Image

from app.core.constants import DEFAULT_HEADER_RESERVATION_BITS
from app.core.exceptions import CapacityCalculationException, PayloadTooLargeException
from app.models.stego import DWTCapacityResult
from app.steganography.lsb.capacity import SUPPORTED_COLOR_MODES
from app.steganography.dwt.validator import DWTValidator

logger = logging.getLogger(__name__)


class DWTCapacityCalculator:
    """
    DWTCapacityCalculator.
    Estimates maximum and remaining bit payload capacities in specific wavelet sub-bands.
    """

    def __init__(
        self,
        default_header_reserved_bits: int = DEFAULT_HEADER_RESERVATION_BITS,
        validator: Optional[DWTValidator] = None,
    ):
        self.default_header_reserved_bits = default_header_reserved_bits
        self.validator = validator or DWTValidator()

    def calculate_capacity(
        self,
        image_input: Union[bytes, Image.Image],
        coefficients_per_block: Optional[int] = None,  # Kept for abstract strategy compatibility (maps to target level or subbands count)
        header_reserved_bits: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> int:
        """
        Calculate usable steganographic capacity in bits for DWT detail sub-bands.

        :param image_input: Image bytes or PIL Image object.
        :param coefficients_per_block: Unused/compat mapping.
        :param header_reserved_bits: Number of bits reserved for steganography header.
        :param options: Config dict (decomposition_level, wavelet_family, selected_subbands).
        :return: Usable bit capacity (int).
        :raises CapacityCalculationException: If capacity calculation parameters are invalid.
        """
        options = options or {}
        reserved_bits = (
            header_reserved_bits if header_reserved_bits is not None else self.default_header_reserved_bits
        )

        wavelet_family = str(options.get("wavelet_family", "haar"))
        decomposition_level = int(options.get("decomposition_level", 1))
        # Default target subbands: Horizontal and Vertical details (LH, HL)
        selected_subbands = list(options.get("selected_subbands", ["LH", "HL"]))

        if reserved_bits < 0:
            raise CapacityCalculationException(f"Invalid header_reserved_bits ({reserved_bits}). Cannot be negative.")

        # 1. Precondition validation
        try:
            _, (w, h), mode = self.validator.validate_preconditions(
                image_input, wavelet_family, decomposition_level
            )
        except Exception as exc:
            raise CapacityCalculationException(f"Precondition validation failed: {str(exc)}")

        # Validate selected subbands
        for sb in selected_subbands:
            sb_upper = sb.upper().strip()
            if sb_upper not in ["LL", "LH", "HL", "HH"]:
                raise CapacityCalculationException(f"Invalid subband selection: '{sb}'. Must be LL, LH, HL, or HH.")

        channels = SUPPORTED_COLOR_MODES[mode]

        # 2. Compute padded dimensions at decomposition level L
        factor = 2 ** decomposition_level
        pad_y = (factor - (h % factor)) % factor
        pad_x = (factor - (w % factor)) % factor
        padded_h = h + pad_y
        padded_w = w + pad_x

        # 3. Calculate coefficient dimensions at target level (deepest level of decomposition)
        subband_h = padded_h // factor
        subband_w = padded_w // factor
        coeffs_per_subband = subband_h * subband_w

        # Total coefficients = coefficients_per_subband * target_subbands_count * channels
        total_coefficients = coeffs_per_subband * len(selected_subbands) * channels
        usable_capacity_bits = max(0, total_coefficients - reserved_bits)

        return usable_capacity_bits

    def validate_capacity(
        self,
        image_input: Union[bytes, Image.Image],
        payload_bits: int,
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None,
        raise_exception: bool = True,
    ) -> bool:
        """
        Validate payload feasibility under DWT capacity limits.

        :param image_input: Image bytes or PIL Image object.
        :param payload_bits: Payload bit count.
        :param coefficients_per_block: Unused/compat mapping.
        :param header_reserved_bits: Number of bits reserved for steganography header.
        :param options: Config dict.
        :param raise_exception: If True, raise PayloadTooLargeException on failure.
        :return: True if valid.
        :raises PayloadTooLargeException: If payload exceeds capacity and raise_exception is True.
        """
        if payload_bits <= 0:
            raise CapacityCalculationException(f"Invalid payload bit length ({payload_bits}). Must be > 0.")

        usable_capacity_bits = self.calculate_capacity(
            image_input,
            coefficients_per_block=coefficients_per_block,
            header_reserved_bits=header_reserved_bits,
            options=options,
        )

        if payload_bits > usable_capacity_bits:
            err_msg = (
                f"Payload size ({payload_bits} bits / {payload_bits // 8} bytes) exceeds available "
                f"DWT steganographic capacity ({usable_capacity_bits} bits / {usable_capacity_bits // 8} bytes)."
            )
            logger.error(f"DWTCapacityCalculator validation failure: {err_msg}")
            if raise_exception:
                raise PayloadTooLargeException(err_msg)
            return False

        return True

    def get_capacity_statistics(
        self,
        image_input: Union[bytes, Image.Image],
        payload_bits: int = 0,
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> DWTCapacityResult:
        """
        Compute structured DWTCapacityResult metrics.

        :param image_input: Image bytes or PIL Image object.
        :param payload_bits: Existing or planned payload size in bits.
        :param coefficients_per_block: Unused/compat mapping.
        :param header_reserved_bits: Number of bits reserved for steganography header.
        :param options: Config dict.
        :return: DWTCapacityResult dataclass model.
        """
        options = options or {}
        reserved_bits = (
            header_reserved_bits if header_reserved_bits is not None else self.default_header_reserved_bits
        )

        wavelet_family = str(options.get("wavelet_family", "haar"))
        decomposition_level = int(options.get("decomposition_level", 1))
        selected_subbands = list(options.get("selected_subbands", ["LH", "HL"]))

        # 1. Preconditions check
        _, (w, h), mode = self.validator.validate_preconditions(
            image_input, wavelet_family, decomposition_level
        )

        channels = SUPPORTED_COLOR_MODES[mode]

        # Calculate padded dimensions
        factor = 2 ** decomposition_level
        pad_y = (factor - (h % factor)) % factor
        pad_x = (factor - (w % factor)) % factor
        padded_h = h + pad_y
        padded_w = w + pad_x

        # Calculate subband sizes
        subband_h = padded_h // factor
        subband_w = padded_w // factor
        coeffs_per_subband = subband_h * subband_w

        total_coefficients = coeffs_per_subband * len(selected_subbands) * channels
        usable_capacity_bits = max(0, total_coefficients - reserved_bits)

        remaining_capacity_bits = max(0, usable_capacity_bits - payload_bits)
        capacity_used_percentage = (
            round((payload_bits / usable_capacity_bits) * 100.0, 4) if usable_capacity_bits > 0 else 0.0
        )

        return DWTCapacityResult(
            total_coefficients=total_coefficients,
            header_reserved_bits=reserved_bits,
            usable_capacity_bits=usable_capacity_bits,
            usable_capacity_bytes=usable_capacity_bits // 8,
            payload_size_bits=payload_bits,
            remaining_capacity_bits=remaining_capacity_bits,
            capacity_used_percentage=capacity_used_percentage,
            wavelet_family=wavelet_family,
            decomposition_level=decomposition_level,
            selected_subbands=[s.upper() for s in selected_subbands],
            dimensions=(w, h),
            color_mode=mode,
            success=True,
        )
