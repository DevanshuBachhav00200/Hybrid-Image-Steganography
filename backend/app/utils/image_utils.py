import base64
from typing import Tuple


def decode_base64_image(base64_str: str) -> bytes:
    """
    Decodes base64 string (including data URL prefix if present) into raw image bytes.
    Raises ValueError if decoding fails.
    """
    if not base64_str:
        raise ValueError("Image base64 string is empty.")
    
    # Strip data URL header if present (e.g. data:image/png;base64,...)
    if "," in base64_str:
        base64_str = base64_str.split(",", 1)[1]
        
    try:
        return base64.b64decode(base64_str.strip())
    except Exception as exc:
        raise ValueError(f"Invalid base64 encoding: {str(exc)}")


def encode_bytes_to_base64(image_bytes: bytes, mime_type: str = "image/png") -> str:
    """Encodes raw image bytes into base64 data URL string."""
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"
