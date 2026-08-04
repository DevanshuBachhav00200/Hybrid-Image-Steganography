"""
LSB Embedder Module.
Provides production-ready Least Significant Bit (LSB) steganographic embedding
for cover images while preserving visual quality, image dimensions, and color space integrity.
"""

import io
import time
import logging
from typing import Dict, Any, Union, Optional, Tuple
import numpy as np
from PIL import Image, UnidentifiedImageError

from app.core.constants import DEFAULT_HEADER_RESERVATION_BITS
from app.core.exceptions import (
    InvalidImageException,
    CorruptedImageException,
    UnsupportedFormatException,
    PayloadTooLargeException,
    EmbeddingException,
)
from app.steganography.lsb.capacity import LSBCapacityCalculator, SUPPORTED_IMAGE_FORMATS, SUPPORTED_COLOR_MODES
from app.models.stego import LSBEmbeddingResult

logger = logging.getLogger(__name__)


class LSBEmbedder:
    """
    LSB Embedding Engine.
    Embeds binary payload bitstream into Least Significant Bits of image pixel channels
    in sequential traversal order with minimal pixel modification overhead.
    """

    def __init__(self, capacity_calculator: Optional[LSBCapacityCalculator] = None):
        """
        Initialize LSB Embedder with an optional Capacity Calculator.
        """
        self.capacity_calculator = capacity_calculator or LSBCapacityCalculator()

    @staticmethod
    def _extract_bitstream(payload_data: Any) -> str:
        """
        Extract raw binary bitstream string ('0' and '1') from various payload object types.

        :param payload_data: Raw string, dictionary, or Payload domain object.
        :return: Binary bitstream string.
        :raises EmbeddingException: If bitstream is empty or contains non-binary characters.
        """
        if payload_data is None:
            raise EmbeddingException("Payload data cannot be None.")

        # Case 1: String
        if isinstance(payload_data, str):
            bitstream = payload_data.strip()
        # Case 2: Dictionary
        elif isinstance(payload_data, dict):
            bitstream = payload_data.get("binary_payload") or payload_data.get("binary_data") or payload_data.get("payload", "")
            if not isinstance(bitstream, str):
                raise EmbeddingException("Invalid dictionary payload format. Missing binary_payload string.")
            bitstream = bitstream.strip()
        # Case 3: Payload Domain Object
        elif hasattr(payload_data, "binary_payload"):
            bitstream = getattr(payload_data, "binary_payload")
            if not isinstance(bitstream, str):
                raise EmbeddingException("Invalid payload object. Attribute 'binary_payload' must be a string.")
            bitstream = bitstream.strip()
        elif hasattr(payload_data, "binary_data"):
            bitstream = getattr(payload_data, "binary_data")
            if not isinstance(bitstream, str):
                raise EmbeddingException("Invalid payload object. Attribute 'binary_data' must be a string.")
            bitstream = bitstream.strip()
        else:
            raise EmbeddingException(
                f"Unsupported payload_data type '{type(payload_data).__name__}'. Expected binary string or Payload object."
            )

        if len(bitstream) == 0:
            raise EmbeddingException("Payload bitstream is empty (0 bits).")

        # Validate that string contains only '0' and '1'
        if not set(bitstream).issubset({"0", "1"}):
            raise EmbeddingException("Payload bitstream contains invalid non-binary characters. Expected '0' and '1' only.")

        return bitstream

    def embed(
        self,
        cover_image_input: Union[bytes, Image.Image],
        payload_data: Any,
        options: Optional[Dict[str, Any]] = None
    ) -> LSBEmbeddingResult:
        """
        Embed binary payload bitstream into cover image Least Significant Bits.

        :param cover_image_input: Cover image raw bytes or PIL Image object.
        :param payload_data: Payload bitstream string, PayloadResult, or dict.
        :param options: Embedding options (bits_per_channel, header_reserved_bits, seed).
        :return: LSBEmbeddingResult containing stego image bytes and metrics.
        """
        start_time = time.perf_counter()
        options = options or {}
        bits_per_channel = options.get("bits_per_channel", 1)
        header_reserved_bits = options.get("header_reserved_bits", DEFAULT_HEADER_RESERVATION_BITS)

        if bits_per_channel != 1:
            # Future extension support check
            logger.info(f"LSBEmbedder: Using bits_per_channel={bits_per_channel}")

        # Step 1: Extract & Validate Payload Bitstream
        bitstream = self._extract_bitstream(payload_data)
        payload_size_bits = len(bitstream)
        payload_size_bytes = payload_size_bits // 8

        # Step 2: Validate Cover Image & Check Capacity
        try:
            usable_capacity_bits = self.capacity_calculator.calculate_capacity(
                cover_image_input, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
            )
        except (InvalidImageException, CorruptedImageException, UnsupportedFormatException):
            raise
        except Exception as exc:
            raise InvalidImageException(f"Failed to analyze cover image for embedding: {str(exc)}")

        if payload_size_bits > usable_capacity_bits:
            err_msg = (
                f"Payload size ({payload_size_bits} bits / {payload_size_bytes} bytes) exceeds available "
                f"LSB steganographic capacity ({usable_capacity_bits} bits / {usable_capacity_bits // 8} bytes)."
            )
            logger.error(f"LSBEmbedder capacity error: {err_msg}")
            raise PayloadTooLargeException(err_msg)

        # Step 3: Load PIL Image and Convert to NumPy Array
        if isinstance(cover_image_input, bytes):
            try:
                raw_img = Image.open(io.BytesIO(cover_image_input))
                detected_fmt = (raw_img.format or "PNG").upper()
                img = raw_img.copy()
                img.format = detected_fmt
            except UnidentifiedImageError:
                raise UnsupportedFormatException("Unidentified image format. Only PNG and BMP are supported.")
            except Exception as exc:
                raise CorruptedImageException(f"Corrupted cover image input bytes: {str(exc)}")
        elif isinstance(cover_image_input, Image.Image):
            detected_fmt = (cover_image_input.format or "PNG").upper()
            img = cover_image_input.copy()
            img.format = detected_fmt
        else:
            raise InvalidImageException(f"Unsupported cover_image_input type '{type(cover_image_input).__name__}'.")

        fmt = img.format.upper()

        if fmt not in SUPPORTED_IMAGE_FORMATS:
            raise UnsupportedFormatException(f"Unsupported image format '{fmt}'. Only PNG and BMP are supported.")

        mode = img.mode.upper()
        if mode not in SUPPORTED_COLOR_MODES:
            raise UnsupportedFormatException(f"Unsupported color mode '{mode}'. Supported modes: {list(SUPPORTED_COLOR_MODES.keys())}")

        width, height = img.size
        channels = SUPPORTED_COLOR_MODES[mode]

        # Step 4: Perform In-Place Sequential LSB Embedding via NumPy
        try:
            img_np = np.array(img, dtype=np.uint8)
            flat_pixels = img_np.ravel()

            pixels_modified = 0
            for i in range(payload_size_bits):
                target_bit = 1 if bitstream[i] == "1" else 0
                current_pixel_val = flat_pixels[i]

                # Optimization: Only modify pixel channel if LSB differs from target bit
                if (current_pixel_val & 1) != target_bit:
                    flat_pixels[i] = (current_pixel_val & 0xFE) | target_bit
                    pixels_modified += 1

            # Reconstruct PIL Image from array
            stego_img = Image.fromarray(img_np, mode=mode)
            buffer = io.BytesIO()
            stego_img.save(buffer, format=fmt)
            stego_image_bytes = buffer.getvalue()
        except Exception as exc:
            logger.error(f"LSBEmbedder embedding exception: {str(exc)}", exc_info=True)
            raise EmbeddingException(f"LSB embedding execution failed: {str(exc)}")

        # Step 5: Metric Calculation & Result Formatting
        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)
        capacity_used_pct = round((payload_size_bits / usable_capacity_bits) * 100.0, 4) if usable_capacity_bits > 0 else 0.0
        remaining_capacity_bits = usable_capacity_bits - payload_size_bits

        logger.info(
            f"LSBEmbedder: Embedded {payload_size_bits} bits into {width}x{height} ({mode}) image | "
            f"Pixels modified: {pixels_modified}/{payload_size_bits} | Util: {capacity_used_pct}% | Time: {execution_time_ms}ms"
        )

        return LSBEmbeddingResult(
            stego_image_bytes=stego_image_bytes,
            image_width=width,
            image_height=height,
            channels=channels,
            color_mode=mode,
            format=fmt,
            payload_size_bits=payload_size_bits,
            payload_size_bytes=payload_size_bytes,
            capacity_bits=usable_capacity_bits,
            capacity_used_percentage=capacity_used_pct,
            remaining_capacity_bits=remaining_capacity_bits,
            pixels_modified=pixels_modified,
            execution_time_ms=execution_time_ms,
            success=True,
        )
