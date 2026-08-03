import os
import io
import uuid
import base64
from datetime import datetime, timezone
from pathlib import Path
from typing import Tuple, Dict, Any, Optional

from PIL import Image, ImageSequence

from app.core.constants import (
    SUPPORTED_EXTENSIONS,
    SUPPORTED_MIME_TYPES,
    MAX_IMAGE_SIZE_BYTES,
    MIN_IMAGE_WIDTH,
    MIN_IMAGE_HEIGHT,
    MAX_IMAGE_WIDTH,
    MAX_IMAGE_HEIGHT,
    MAX_MEGAPIXELS,
)
from app.core.exceptions import (
    InvalidImageException,
    CorruptedImageException,
    UnsupportedFormatException,
    ImageTooLargeException,
    ImageDimensionException,
)
from app.schemas.upload import ImageMetadata


def generate_upload_id() -> str:
    """Generate a unique UUIDv4 string for upload identification."""
    return str(uuid.uuid4())


def calculate_image_size(file_bytes: bytes) -> int:
    """Calculate byte size of an image file."""
    return len(file_bytes) if file_bytes else 0


def validate_extension(filename: str) -> str:
    """
    Validate filename extension against strictly allowed formats (PNG, BMP).
    Raises UnsupportedFormatException if format is rejected.
    """
    if not filename:
        raise UnsupportedFormatException("Filename is missing or empty.")
    
    ext = Path(filename).suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFormatException(
            f"Unsupported file format '{ext}'. Only PNG and BMP images are supported."
        )
    return ext.lstrip(".").upper()


def validate_mime(mime_type: str) -> bool:
    """
    Validate MIME type string against allowed MIME types.
    Raises UnsupportedFormatException if mime type is rejected.
    """
    if not mime_type or mime_type.lower() not in SUPPORTED_MIME_TYPES:
        raise UnsupportedFormatException(
            f"Unsupported MIME type '{mime_type}'. Only image/png and image/bmp are allowed."
        )
    return True


def validate_magic_bytes(file_bytes: bytes) -> str:
    """
    Inspect magic byte signatures to detect actual format and reject fake extensions.
    Raises UnsupportedFormatException or CorruptedImageException if magic bytes mismatch.
    """
    if not file_bytes or len(file_bytes) < 8:
        raise CorruptedImageException("File is empty or too small to contain a valid header.")

    # PNG magic bytes signature: \x89PNG\r\n\x1a\n
    if file_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "PNG"

    # BMP magic bytes signature: BM
    if file_bytes.startswith(b"BM"):
        return "BMP"

    # Specific rejections with informative error messages
    if file_bytes.startswith(b"\xff\xd8\xff"):
        raise UnsupportedFormatException("JPEG format is rejected. Only PNG and BMP formats are supported.")
    if file_bytes.startswith(b"GIF87a") or file_bytes.startswith(b"GIF89a"):
        raise UnsupportedFormatException("GIF format is rejected. Only PNG and BMP formats are supported.")
    if file_bytes.startswith(b"RIFF") and len(file_bytes) >= 12 and file_bytes[8:12] == b"WEBP":
        raise UnsupportedFormatException("WEBP format is rejected. Only PNG and BMP formats are supported.")
    if file_bytes.startswith(b"II*\x00") or file_bytes.startswith(b"MM\x00*"):
        raise UnsupportedFormatException("TIFF format is rejected. Only PNG and BMP formats are supported.")
    if b"<svg" in file_bytes[:100].lower():
        raise UnsupportedFormatException("SVG format is rejected. Only PNG and BMP formats are supported.")

    raise UnsupportedFormatException("Unrecognized or unsupported image file header. Only PNG and BMP images are supported.")


def verify_integrity(file_bytes: bytes) -> Image.Image:
    """
    Open image safely with PIL, check for structural corruption and animated frames.
    Returns opened PIL Image object.
    Raises CorruptedImageException or InvalidImageException if unreadable/animated.
    """
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()  # Verify structural integrity
    except Exception as exc:
        raise CorruptedImageException(f"Image header or structural data is corrupted: {str(exc)}")

    # Re-open for image properties inspection after verify()
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.load()  # Force loading pixel data to detect corruption
    except Exception as exc:
        raise CorruptedImageException(f"Failed to load image pixel data: {str(exc)}")

    # Check for animated images (GIF, Animated PNG)
    if getattr(img, "is_animated", False) and getattr(img, "n_frames", 1) > 1:
        raise InvalidImageException("Animated multi-frame images are not supported.")

    return img


def extract_metadata(file_bytes: bytes, filename: str, upload_id: str) -> ImageMetadata:
    """
    Extract comprehensive metadata from validated image bytes.
    Enforces dimension and megapixel boundaries.
    """
    size_bytes = calculate_image_size(file_bytes)
    if size_bytes > MAX_IMAGE_SIZE_BYTES:
        raise ImageTooLargeException(
            f"Image size ({size_bytes} bytes) exceeds maximum limit of {MAX_IMAGE_SIZE_BYTES} bytes."
        )

    # Validate format via extension, MIME, and magic bytes
    ext = validate_extension(filename)
    format_name = validate_magic_bytes(file_bytes)

    # Open and verify structural integrity
    img = verify_integrity(file_bytes)

    width, height = img.size
    megapixels = (width * height) / 1_000_000

    # Validate image dimensions
    if width < MIN_IMAGE_WIDTH or height < MIN_IMAGE_HEIGHT:
        raise ImageDimensionException(
            f"Image dimensions ({width}x{height}) are smaller than minimum allowed ({MIN_IMAGE_WIDTH}x{MIN_IMAGE_HEIGHT})."
        )
    if width > MAX_IMAGE_WIDTH or height > MAX_IMAGE_HEIGHT:
        raise ImageDimensionException(
            f"Image dimensions ({width}x{height}) exceed maximum allowed ({MAX_IMAGE_WIDTH}x{MAX_IMAGE_HEIGHT})."
        )
    if megapixels > MAX_MEGAPIXELS:
        raise ImageDimensionException(
            f"Image size ({megapixels:.2f} MP) exceeds maximum allowed megapixel limit of {MAX_MEGAPIXELS} MP."
        )

    # Determine channels and color mode
    color_mode = img.mode
    mode_to_channels = {"1": 1, "L": 1, "P": 1, "RGB": 3, "RGBA": 4, "CMYK": 4, "YCbCr": 3, "I": 1, "F": 1}
    channels = mode_to_channels.get(color_mode, len(img.getbands()) if hasattr(img, "getbands") else 3)

    mime_type = "image/png" if format_name == "PNG" else "image/bmp"

    return ImageMetadata(
        upload_id=upload_id,
        filename=filename,
        extension=ext,
        width=width,
        height=height,
        channels=channels,
        color_mode=color_mode,
        bit_depth=8,
        file_size_bytes=size_bytes,
        mime_type=mime_type,
        upload_time=datetime.now(timezone.utc).isoformat(),
    )


def delete_temp_file(file_path: str) -> bool:
    """Safely delete temporary image file from storage if present."""
    try:
        path = Path(file_path)
        if path.exists() and path.is_file():
            os.remove(path)
            return True
    except Exception:
        pass
    return False


def decode_base64_image(base64_str: str) -> bytes:
    """Decodes base64 string into raw image bytes."""
    if not base64_str:
        raise ValueError("Image base64 string is empty.")
    if "," in base64_str:
        base64_str = base64_str.split(",", 1)[1]
    return base64.b64decode(base64_str.strip())


def encode_bytes_to_base64(image_bytes: bytes, mime_type: str = "image/png") -> str:
    """Encodes image bytes into base64 data URL."""
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"
