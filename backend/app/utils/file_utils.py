import os
from pathlib import Path
from typing import Optional


def ensure_directory_exists(directory_path: str) -> Path:
    """Ensure specified directory path exists, creating parents as necessary."""
    path = Path(directory_path)
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_file_extension(filename: str) -> str:
    """Extract file extension in uppercase format without leading dot."""
    if not filename:
        return ""
    return Path(filename).suffix.lstrip(".").upper()


def is_file_size_valid(file_bytes: bytes, max_bytes: int) -> bool:
    """Validate file byte array against maximum size constraint."""
    return len(file_bytes) <= max_bytes
