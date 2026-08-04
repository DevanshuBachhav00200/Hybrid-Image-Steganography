"""
DCT Capacity Calculator Module.
Provides production-ready capacity calculation, payload feasibility validation,
and metric generation for Discrete Cosine Transform (DCT) frequency domain steganography.
"""

import io
import logging
from typing import Dict, Any, Union, Tuple, Optional
from PIL import Image, UnidentifiedImageError

from app.core.constants import DEFAULT_HEADER_RESERVATION_BITS
from app.core.exceptions import (
    InvalidImageException,
    CorruptedImageException,
    UnsupportedFormatException,
    CapacityCalculationException,
    PayloadTooLargeException,
)
from app.steganography.lsb.capacity import SUPPORTED_IMAGE_FORMATS, SUPPORTED_COLOR_MODES
from app.steganography.dct.utils import DCTUtils
from app.models.stego import DCTCapacityResult

logger = logging.getLogger(__name__)


class DCTCapacityCalculator:
    """
    DCT Steganographic Capacity Calculator.
    Calculates 8x8 block counts, usable frequency coefficients, usable payload limits,
    header space reservations, payload utilization percentages, and embedding feasibility.
    """

    def __init__(
        self,
        default_coefficients_per_block: int = 1,
        default_header_reserved_bits: int = DEFAULT_HEADER_RESERVATION_BITS,
    ):
        """
        Initialize DCT Capacity Calculator with configurable defaults.
        """
        self.default_coefficients_per_block = default_coefficients_per_block
        self.default_header_reserved_bits = default_header_reserved_bits

    @staticmethod
    def _parse_image_input(
        image_input: Union[bytes, Image.Image, Dict[str, Any]]
    ) -> Tuple[int, int, int, str]:
        """
        Parse raw image input, extracting dimensions, channel count, and color mode.
        """
        if image_input is None:
            raise InvalidImageException("Image input cannot be None.")

        # Case 1: Metadata Dict
        if isinstance(image_input, dict):
            width = image_input.get("width")
            height = image_input.get("height")
            color_mode = image_input.get("color_mode", "RGB").upper()
            channels = image_input.get("channels")

            if not isinstance(width, int) or not isinstance(height, int) or width <= 0 or height <= 0:
                raise InvalidImageException(f"Invalid image dimensions in metadata: width={width}, height={height}")

            if color_mode not in SUPPORTED_COLOR_MODES:
                raise UnsupportedFormatException(f"Unsupported color mode '{color_mode}'.")

            channel_count = channels if channels and isinstance(channels, int) else SUPPORTED_COLOR_MODES[color_mode]
            return width, height, channel_count, color_mode

        # Case 2: Bytes
        if isinstance(image_input, bytes):
            if len(image_input) == 0:
                raise InvalidImageException("Image byte payload is empty (0 bytes).")
            try:
                img = Image.open(io.BytesIO(image_input))
                img.verify()
                img = Image.open(io.BytesIO(image_input))
            except UnidentifiedImageError:
                raise UnsupportedFormatException("Unidentified image format. Only PNG and BMP are supported.")
            except (OSError, SyntaxError, ValueError) as exc:
                raise CorruptedImageException(f"Corrupted or invalid image byte stream: {str(exc)}")
            except Exception as exc:
                raise InvalidImageException(f"Failed to load image input: {str(exc)}")
        elif isinstance(image_input, Image.Image):
            img = image_input
        else:
            raise InvalidImageException(f"Unsupported image_input type '{type(image_input).__name__}'.")

        fmt = (img.format or "PNG").upper()
        if fmt not in SUPPORTED_IMAGE_FORMATS:
            raise UnsupportedFormatException(f"Unsupported image format '{fmt}'. Only PNG and BMP are supported.")

        mode = img.mode.upper()
        if mode not in SUPPORTED_COLOR_MODES:
            raise UnsupportedFormatException(f"Unsupported color mode '{mode}'. Supported modes: {list(SUPPORTED_COLOR_MODES.keys())}")

        width, height = img.size
        if width < 8 or height < 8:
            raise InvalidImageException(f"Image dimensions ({width}x{height}) must be at least 8x8 pixels for DCT.")

        channel_count = SUPPORTED_COLOR_MODES[mode]
        return width, height, channel_count, mode

    def calculate_capacity(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> int:
        """
        Calculate usable steganographic embedding capacity in bits for a given image under DCT.

        Formulas:
          Padded Width = ceil(Width / 8) * 8
          Padded Height = ceil(Height / 8) * 8
          Total 8x8 Blocks = (Padded Width / 8) * (Padded Height / 8) * Channels
          Total Capacity Bits = Total 8x8 Blocks * coefficients_per_block
          Usable Capacity Bits = max(0, Total Capacity Bits - header_reserved_bits)

        :param image_input: Raw image bytes, PIL Image, or metadata dict.
        :param coefficients_per_block: Number of target frequency coefficients used per 8x8 block (1-16).
        :param header_reserved_bits: Reserved header bits.
        :return: Usable bit capacity (int).
        """
        cpb = coefficients_per_block if coefficients_per_block is not None else self.default_coefficients_per_block
        reserved_bits = (
            header_reserved_bits if header_reserved_bits is not None else self.default_header_reserved_bits
        )

        if cpb < 1 or cpb > 16:
            raise CapacityCalculationException(f"Invalid coefficients_per_block ({cpb}). Must be between 1 and 16.")
        if reserved_bits < 0:
            raise CapacityCalculationException(f"Invalid header_reserved_bits ({reserved_bits}). Cannot be negative.")

        width, height, channels, _ = self._parse_image_input(image_input)

        pad_y = (8 - (height % 8)) % 8
        pad_x = (8 - (width % 8)) % 8
        padded_h = height + pad_y
        padded_w = width + pad_x

        total_8x8_blocks = (padded_h // 8) * (padded_w // 8) * channels
        total_capacity_bits = total_8x8_blocks * cpb
        usable_capacity_bits = max(0, total_capacity_bits - reserved_bits)

        logger.debug(
            f"DCTCapacityCalculator: Image {width}x{height} -> Padded {padded_w}x{padded_h} ({channels} ch) | "
            f"Blocks: {total_8x8_blocks} | Usable: {usable_capacity_bits} bits"
        )
        return usable_capacity_bits

    def calculate_available_space(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int = 0,
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> int:
        """
        Calculate remaining free embedding space in bits after accounting for payload size.
        """
        if payload_bits < 0:
            raise CapacityCalculationException(f"Payload size cannot be negative ({payload_bits}).")

        usable_capacity_bits = self.calculate_capacity(
            image_input, coefficients_per_block=coefficients_per_block, header_reserved_bits=header_reserved_bits
        )
        remaining_bits = max(0, usable_capacity_bits - payload_bits)
        return remaining_bits

    def can_embed_payload(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int,
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> bool:
        """
        Determine whether a payload of specified bit length can fit inside DCT cover image capacity.
        """
        if payload_bits <= 0:
            return False

        try:
            usable_capacity_bits = self.calculate_capacity(
                image_input, coefficients_per_block=coefficients_per_block, header_reserved_bits=header_reserved_bits
            )
            return payload_bits <= usable_capacity_bits
        except Exception as exc:
            logger.warning(f"DCTCapacityCalculator: Validation check failed: {str(exc)}")
            return False

    def validate_capacity(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int,
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
        raise_exception: bool = True,
    ) -> bool:
        """
        Validate payload feasibility under DCT capacity rules. Throws PayloadTooLargeException if payload exceeds capacity.
        """
        if payload_bits <= 0:
            raise CapacityCalculationException(f"Invalid payload bit length ({payload_bits}). Must be > 0.")

        usable_capacity_bits = self.calculate_capacity(
            image_input, coefficients_per_block=coefficients_per_block, header_reserved_bits=header_reserved_bits
        )

        if payload_bits > usable_capacity_bits:
            err_msg = (
                f"Payload size ({payload_bits} bits / {payload_bits // 8} bytes) exceeds available "
                f"DCT steganographic capacity ({usable_capacity_bits} bits / {usable_capacity_bits // 8} bytes)."
            )
            logger.error(f"DCTCapacityCalculator validation failure: {err_msg}")
            if raise_exception:
                raise PayloadTooLargeException(err_msg)
            return False

        return True

    def get_capacity_statistics(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int = 0,
        coefficients_per_block: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> DCTCapacityResult:
        """
        Generate detailed structured DCTCapacityResult metrics.
        """
        if payload_bits < 0:
            raise CapacityCalculationException(f"Payload size cannot be negative ({payload_bits}).")

        cpb = coefficients_per_block if coefficients_per_block is not None else self.default_coefficients_per_block
        reserved_bits = (
            header_reserved_bits if header_reserved_bits is not None else self.default_header_reserved_bits
        )

        width, height, channels, color_mode = self._parse_image_input(image_input)
        total_pixels = width * height

        pad_y = (8 - (height % 8)) % 8
        pad_x = (8 - (width % 8)) % 8
        padded_h = height + pad_y
        padded_w = width + pad_x

        total_8x8_blocks = (padded_h // 8) * (padded_w // 8) * channels
        total_capacity_bits = total_8x8_blocks * cpb
        total_capacity_bytes = total_capacity_bits // 8

        usable_capacity_bits = max(0, total_capacity_bits - reserved_bits)
        usable_capacity_bytes = usable_capacity_bits // 8

        payload_size_bits = payload_bits
        payload_size_bytes = payload_size_bits // 8

        remaining_capacity_bits = max(0, usable_capacity_bits - payload_size_bits)
        remaining_capacity_bytes = remaining_capacity_bits // 8

        utilization_pct = (
            round((payload_size_bits / usable_capacity_bits) * 100.0, 4)
            if usable_capacity_bits > 0
            else 0.0
        )

        can_embed = (payload_size_bits > 0) and (payload_size_bits <= usable_capacity_bits)

        logger.info(
            f"DCTCapacityCalculator: Analyzed image {width}x{height} ({color_mode}, {channels}ch) | "
            f"Total Blocks: {total_8x8_blocks} | Usable: {usable_capacity_bits} bits | "
            f"Payload: {payload_size_bits} bits | Util: {utilization_pct}% | Can Embed: {can_embed}"
        )

        return DCTCapacityResult(
            image_width=width,
            image_height=height,
            padded_width=padded_w,
            padded_height=padded_h,
            channels=channels,
            total_pixels=total_pixels,
            color_mode=color_mode,
            total_8x8_blocks=total_8x8_blocks,
            coefficients_per_block=cpb,
            total_capacity_bits=total_capacity_bits,
            total_capacity_bytes=total_capacity_bytes,
            header_reserved_bits=reserved_bits,
            usable_capacity_bits=usable_capacity_bits,
            usable_capacity_bytes=usable_capacity_bytes,
            payload_size_bits=payload_size_bits,
            payload_size_bytes=payload_size_bytes,
            remaining_capacity_bits=remaining_capacity_bits,
            remaining_capacity_bytes=remaining_capacity_bytes,
            utilization_percentage=utilization_pct,
            can_embed=can_embed,
        )
