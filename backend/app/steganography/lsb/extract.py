"""
LSB Extractor Module.
Provides production-ready Least Significant Bit (LSB) steganographic payload extraction.
Recovers binary bitstream payloads from stego image pixels with early termination and header validation.
"""

import io
import time
import logging
from typing import Dict, Any, Union, Optional
import numpy as np
from PIL import Image, UnidentifiedImageError

from app.core.exceptions import (
    InvalidImageException,
    CorruptedImageException,
    UnsupportedFormatException,
    ExtractionException,
    NoHiddenDataException,
    CorruptedHeaderException,
    IncompletePayloadException,
)
from app.steganography.lsb.capacity import SUPPORTED_IMAGE_FORMATS, SUPPORTED_COLOR_MODES
from app.processing.binary.bitstream import bits_to_bytes
from app.processing.binary.header import parse_header
from app.processing.binary.exceptions import InvalidHeaderException, PayloadLengthException
from app.models.stego import LSBExtractionResult

logger = logging.getLogger(__name__)

HEADER_BITS_LEN = 128  # 16 bytes * 8 bits = 128 bits


class LSBExtractor:
    """
    LSB Extraction Engine.
    Reads header metadata from image LSBs, determines payload bit length, and recovers
    the exact binary payload bitstream with early termination.
    """

    def extract(
        self,
        stego_image_input: Union[bytes, Image.Image],
        options: Optional[Dict[str, Any]] = None
    ) -> LSBExtractionResult:
        """
        Extract hidden binary payload bitstream from stego image LSBs.

        :param stego_image_input: Stego image raw bytes or PIL Image object.
        :param options: Extraction options (bits_per_channel, max_bits).
        :return: LSBExtractionResult containing recovered binary bitstream and header metadata.
        :raises InvalidImageException: If image input is invalid or unreadable.
        :raises UnsupportedFormatException: If format or color mode is unsupported.
        :raises NoHiddenDataException: If valid steganography magic header is missing.
        :raises CorruptedHeaderException: If header version, algorithm ID, or length is invalid.
        :raises IncompletePayloadException: If payload extends beyond stego image pixel count.
        :raises ExtractionException: For general extraction failures.
        """
        start_time = time.perf_counter()
        options = options or {}
        bits_per_channel = options.get("bits_per_channel", 1)

        # Step 1: Load PIL Image
        if isinstance(stego_image_input, bytes):
            if len(stego_image_input) == 0:
                raise InvalidImageException("Stego image byte payload is empty (0 bytes).")
            try:
                raw_img = Image.open(io.BytesIO(stego_image_input))
                detected_fmt = (raw_img.format or "PNG").upper()
                img = raw_img.copy()
                img.format = detected_fmt
            except UnidentifiedImageError:
                raise UnsupportedFormatException("Unidentified stego image format. Only PNG and BMP are supported.")
            except Exception as exc:
                raise CorruptedImageException(f"Corrupted stego image byte stream: {str(exc)}")
        elif isinstance(stego_image_input, Image.Image):
            detected_fmt = (stego_image_input.format or "PNG").upper()
            img = stego_image_input.copy()
            img.format = detected_fmt
        else:
            raise InvalidImageException(f"Unsupported stego_image_input type '{type(stego_image_input).__name__}'.")

        fmt = img.format.upper()
        if fmt not in SUPPORTED_IMAGE_FORMATS:
            raise UnsupportedFormatException(f"Unsupported stego image format '{fmt}'. Only PNG and BMP are supported.")

        mode = img.mode.upper()
        if mode not in SUPPORTED_COLOR_MODES:
            raise UnsupportedFormatException(f"Unsupported color mode '{mode}'. Supported modes: {list(SUPPORTED_COLOR_MODES.keys())}")

        width, height = img.size
        channels = SUPPORTED_COLOR_MODES[mode]
        total_pixel_channels = width * height * channels

        if total_pixel_channels < HEADER_BITS_LEN:
            raise ExtractionException(
                f"Stego image total pixel channels ({total_pixel_channels}) is smaller than required 128-bit header size."
            )

        # Step 2: Extract Header LSB Bits
        try:
            img_np = np.array(img, dtype=np.uint8)
            flat_pixels = img_np.ravel()

            header_bits_seq = flat_pixels[:HEADER_BITS_LEN] & 1
            header_bits_str = "".join(str(b) for b in header_bits_seq)
            header_bytes = bits_to_bytes(header_bits_str)
        except Exception as exc:
            raise ExtractionException(f"Failed to read header bits from image pixels: {str(exc)}")

        # Step 3: Parse and Validate Embedded Header
        try:
            header_model = parse_header(header_bytes)
        except InvalidHeaderException as exc:
            err_msg = str(exc)
            if "magic bytes" in err_msg.lower():
                logger.warning("LSBExtractor: No valid steganography magic header ('STEGO') found.")
                raise NoHiddenDataException("No valid steganography magic header ('STEGO') found in image LSBs.")
            logger.warning(f"LSBExtractor: Header validation failed: {err_msg}")
            raise CorruptedHeaderException(f"Stego header corrupted: {err_msg}")

        except PayloadLengthException as exc:
            raise CorruptedHeaderException(f"Stego header payload length invalid: {str(exc)}")
        except Exception as exc:
            raise CorruptedHeaderException(f"Failed to parse stego header: {str(exc)}")

        # Step 4: Determine Total Payload Length & Check Bounds
        payload_bytes_len = header_model.payload_length
        total_payload_bits = (16 + payload_bytes_len) * 8

        if total_payload_bits > total_pixel_channels:
            raise IncompletePayloadException(
                f"Header specifies total payload of {total_payload_bits} bits, but cover image capacity is only "
                f"{total_pixel_channels} bits. Stego image payload is truncated or corrupted."
            )

        # Step 5: Extract Complete Binary Bitstream with Early Termination
        try:
            payload_bits_seq = flat_pixels[:total_payload_bits] & 1
            recovered_payload_str = "".join(str(b) for b in payload_bits_seq)
        except Exception as exc:
            raise ExtractionException(f"Failed to extract payload bitstream: {str(exc)}")

        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        header_dict = {
            "magic_number": header_model.magic_number.decode("ascii", errors="ignore"),
            "version": header_model.version,
            "algorithm_id": header_model.algorithm_id,
            "payload_length": header_model.payload_length,
            "header_size": header_model.header_size,
            "checksum": header_model.checksum,
        }

        image_metadata = {
            "width": width,
            "height": height,
            "channels": channels,
            "color_mode": mode,
            "format": fmt,
        }

        logger.info(
            f"LSBExtractor: Successfully extracted {len(recovered_payload_str)} bits ({payload_bytes_len} bytes) "
            f"from {width}x{height} ({mode}) stego image in {execution_time_ms}ms."
        )

        return LSBExtractionResult(
            recovered_payload=recovered_payload_str,
            payload_size_bits=len(recovered_payload_str),
            payload_size_bytes=len(recovered_payload_str) // 8,
            header_info=header_dict,
            extraction_time_ms=execution_time_ms,
            success=True,
            image_metadata=image_metadata,
        )
