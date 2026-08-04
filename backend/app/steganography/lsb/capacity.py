"""
LSB Capacity Calculator Module.
Provides production-ready capacity calculation, payload feasibility validation,
and detailed metric generation for Least Significant Bit (LSB) image steganography.
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
from app.models.stego import LSBCapacityResult

logger = logging.getLogger(__name__)

# Supported Image Formats & Color Modes
SUPPORTED_IMAGE_FORMATS = {"PNG", "BMP"}
SUPPORTED_COLOR_MODES: Dict[str, int] = {
    "RGB": 3,
    "RGBA": 4,
    "L": 1,  # Grayscale
}


class LSBCapacityCalculator:
    """
    LSB Steganographic Capacity Calculator component.
    Determines pixel channel counts, maximum bit capacities, usable payload limits,
    header space reservations, payload utilization percentages, and embedding feasibility.
    """

    def __init__(
        self,
        default_bits_per_channel: int = 1,
        default_header_reserved_bits: int = DEFAULT_HEADER_RESERVATION_BITS,
    ):
        """
        Initialize LSB Capacity Calculator with configurable defaults.

        :param default_bits_per_channel: Default number of LSB bits used per pixel channel.
        :param default_header_reserved_bits: Default header reservation space in bits.
        """
        self.default_bits_per_channel = default_bits_per_channel
        self.default_header_reserved_bits = default_header_reserved_bits

    @staticmethod
    def _parse_image_input(
        image_input: Union[bytes, Image.Image, Dict[str, Any]]
    ) -> Tuple[int, int, int, str]:
        """
        Parse and validate raw image input, extracting dimensions, channel count, and color mode.

        :param image_input: Raw byte array, PIL Image, or metadata dictionary.
        :return: Tuple of (width, height, channel_count, color_mode).
        :raises InvalidImageException: If image input is invalid or corrupt.
        :raises CorruptedImageException: If image header or byte stream is corrupt.
        :raises UnsupportedFormatException: If image format or color mode is unsupported.
        """
        if image_input is None:
            raise InvalidImageException("Image input cannot be None.")

        # Case 1: Metadata Dictionary
        if isinstance(image_input, dict):
            width = image_input.get("width")
            height = image_input.get("height")
            color_mode = image_input.get("color_mode", "RGB").upper()
            channels = image_input.get("channels")

            if not isinstance(width, int) or not isinstance(height, int) or width <= 0 or height <= 0:
                raise InvalidImageException(f"Invalid image dimensions in metadata: width={width}, height={height}")

            if color_mode not in SUPPORTED_COLOR_MODES:
                raise UnsupportedFormatException(
                    f"Unsupported color mode '{color_mode}'. Supported modes: {list(SUPPORTED_COLOR_MODES.keys())}"
                )

            channel_count = channels if channels and isinstance(channels, int) else SUPPORTED_COLOR_MODES[color_mode]
            return width, height, channel_count, color_mode

        # Case 2: Raw Image Bytes
        if isinstance(image_input, bytes):
            if len(image_input) == 0:
                raise InvalidImageException("Image byte payload is empty (0 bytes).")
            try:
                img = Image.open(io.BytesIO(image_input))
                img.verify()  # Verify structural integrity
                img = Image.open(io.BytesIO(image_input))  # Reopen after verify()
            except UnidentifiedImageError:
                raise UnsupportedFormatException(
                    "Unidentified image format. Image could not be recognized (Only PNG and BMP are supported)."
                )
            except (OSError, SyntaxError, ValueError) as exc:
                raise CorruptedImageException(f"Corrupted or invalid image byte stream: {str(exc)}")
            except Exception as exc:
                raise InvalidImageException(f"Failed to load image input: {str(exc)}")
        # Case 3: PIL Image Object
        elif isinstance(image_input, Image.Image):
            img = image_input
        else:
            raise InvalidImageException(
                f"Unsupported image_input type '{type(image_input).__name__}'. Expected bytes, PIL Image, or dict."
            )

        # Validate PIL Image Properties
        fmt = (img.format or "PNG").upper()
        if fmt not in SUPPORTED_IMAGE_FORMATS:
            raise UnsupportedFormatException(
                f"Unsupported image format '{fmt}'. Only PNG and BMP images are supported for LSB steganography."
            )

        mode = img.mode.upper()
        if mode == "P":
            raise UnsupportedFormatException(
                "Indexed palette (P) images are not directly supported for LSB embedding. "
                "Convert the image to RGB or RGBA mode first."
            )

        if mode not in SUPPORTED_COLOR_MODES:
            raise UnsupportedFormatException(
                f"Unsupported image color mode '{mode}'. Supported modes: {list(SUPPORTED_COLOR_MODES.keys())}"
            )

        width, height = img.size
        if width <= 0 or height <= 0:
            raise InvalidImageException(f"Invalid image dimensions ({width}x{height}).")

        channel_count = SUPPORTED_COLOR_MODES[mode]
        return width, height, channel_count, mode

    def calculate_capacity(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        bits_per_channel: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> int:
        """
        Calculate usable steganographic embedding capacity in bits for a given image.

        Formulas:
          Total Pixels = Width * Height
          Total Capacity Bits = Total Pixels * Channels * bits_per_channel
          Usable Capacity Bits = max(0, Total Capacity Bits - header_reserved_bits)

        :param image_input: Raw image bytes, PIL Image, or metadata dict.
        :param bits_per_channel: LSB bit depth per channel (defaults to class configuration).
        :param header_reserved_bits: Reserved bits for steganography header & metadata.
        :return: Usable capacity in bits (int).
        """
        bpc = bits_per_channel if bits_per_channel is not None else self.default_bits_per_channel
        reserved_bits = (
            header_reserved_bits if header_reserved_bits is not None else self.default_header_reserved_bits
        )

        if bpc < 1 or bpc > 8:
            raise CapacityCalculationException(f"Invalid bits_per_channel ({bpc}). Must be between 1 and 8.")
        if reserved_bits < 0:
            raise CapacityCalculationException(f"Invalid header_reserved_bits ({reserved_bits}). Cannot be negative.")

        width, height, channels, _ = self._parse_image_input(image_input)
        total_pixels = width * height
        total_capacity_bits = total_pixels * channels * bpc
        usable_capacity_bits = max(0, total_capacity_bits - reserved_bits)

        logger.debug(
            f"LSBCapacityCalculator: Image {width}x{height} ({channels} ch) -> "
            f"Total Capacity: {total_capacity_bits} bits, Usable: {usable_capacity_bits} bits (Reserved: {reserved_bits} bits)"
        )
        return usable_capacity_bits

    def calculate_available_space(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int = 0,
        bits_per_channel: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> int:
        """
        Calculate remaining free embedding space in bits after accounting for payload size.

        Formula:
          Remaining Bits = max(0, Usable Capacity Bits - payload_bits)

        :param image_input: Raw image bytes, PIL Image, or metadata dict.
        :param payload_bits: Size of payload in bits to embed.
        :param bits_per_channel: Bit depth per channel.
        :param header_reserved_bits: Reserved header bits.
        :return: Remaining capacity in bits (int).
        """
        if payload_bits < 0:
            raise CapacityCalculationException(f"Payload size cannot be negative ({payload_bits}).")

        usable_capacity_bits = self.calculate_capacity(
            image_input, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
        )
        remaining_bits = max(0, usable_capacity_bits - payload_bits)
        return remaining_bits

    def can_embed_payload(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int,
        bits_per_channel: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> bool:
        """
        Determine whether a payload of specified bit length can fit inside cover image capacity.

        :param image_input: Raw image bytes, PIL Image, or metadata dict.
        :param payload_bits: Size of payload in bits.
        :param bits_per_channel: Bit depth per channel.
        :param header_reserved_bits: Reserved header bits.
        :return: True if payload_bits > 0 and payload_bits <= usable_capacity_bits, False otherwise.
        """
        if payload_bits <= 0:
            logger.warning(f"LSBCapacityCalculator: Evaluated payload_bits={payload_bits} <= 0 -> False")
            return False

        try:
            usable_capacity_bits = self.calculate_capacity(
                image_input, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
            )
            can_fit = payload_bits <= usable_capacity_bits
            if not can_fit:
                logger.info(
                    f"LSBCapacityCalculator: Payload ({payload_bits} bits) exceeds usable capacity ({usable_capacity_bits} bits)."
                )
            return can_fit
        except Exception as exc:
            logger.warning(f"LSBCapacityCalculator: Validation check failed with error: {str(exc)}")
            return False

    def validate_capacity(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int,
        bits_per_channel: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
        raise_exception: bool = True,
    ) -> bool:
        """
        Validate that payload fits within cover image capacity. Throws PayloadTooLargeException if invalid.

        :param image_input: Raw image bytes, PIL Image, or metadata dict.
        :param payload_bits: Size of payload in bits.
        :param bits_per_channel: Bit depth per channel.
        :param header_reserved_bits: Reserved header bits.
        :param raise_exception: If True, raises PayloadTooLargeException on failure.
        :return: True if valid.
        """
        if payload_bits <= 0:
            raise CapacityCalculationException(f"Invalid payload bit length ({payload_bits}). Must be greater than 0.")

        usable_capacity_bits = self.calculate_capacity(
            image_input, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
        )

        if payload_bits > usable_capacity_bits:
            err_msg = (
                f"Payload size ({payload_bits} bits / {payload_bits // 8} bytes) exceeds available "
                f"LSB steganographic capacity ({usable_capacity_bits} bits / {usable_capacity_bits // 8} bytes)."
            )
            logger.error(f"LSBCapacityCalculator validation failure: {err_msg}")
            if raise_exception:
                raise PayloadTooLargeException(err_msg)
            return False

        return True

    def get_capacity_statistics(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int = 0,
        bits_per_channel: Optional[int] = None,
        header_reserved_bits: Optional[int] = None,
    ) -> LSBCapacityResult:
        """
        Generate a detailed structured LSBCapacityResult containing comprehensive analysis metrics.

        :param image_input: Raw image bytes, PIL Image, or metadata dict.
        :param payload_bits: Size of payload in bits (optional, defaults to 0).
        :param bits_per_channel: LSB depth per channel.
        :param header_reserved_bits: Reserved header bits.
        :return: LSBCapacityResult structured pydantic model.
        """
        if payload_bits < 0:
            raise CapacityCalculationException(f"Payload size cannot be negative ({payload_bits}).")

        bpc = bits_per_channel if bits_per_channel is not None else self.default_bits_per_channel
        reserved_bits = (
            header_reserved_bits if header_reserved_bits is not None else self.default_header_reserved_bits
        )

        width, height, channels, color_mode = self._parse_image_input(image_input)
        total_pixels = width * height
        total_capacity_bits = total_pixels * channels * bpc
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
            f"LSBCapacityCalculator: Analyzed image {width}x{height} ({color_mode}, {channels}ch) | "
            f"Total: {total_capacity_bits} bits | Usable: {usable_capacity_bits} bits | "
            f"Payload: {payload_size_bits} bits | Util: {utilization_pct}% | Can Embed: {can_embed}"
        )

        return LSBCapacityResult(
            image_width=width,
            image_height=height,
            channels=channels,
            total_pixels=total_pixels,
            color_mode=color_mode,
            bits_per_channel=bpc,
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
