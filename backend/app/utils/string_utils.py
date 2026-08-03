import re


def sanitize_string(text: str) -> str:
    """Strip leading/trailing whitespace and sanitize control characters."""
    if not text:
        return ""
    return text.strip()


def mask_sensitive_string(text: str, visible_chars: int = 2) -> str:
    """Mask string for logging purposes (e.g., 'password' -> 'pa******')."""
    if not text:
        return "*****"
    if len(text) <= visible_chars:
        return "*" * len(text)
    return text[:visible_chars] + "*" * (len(text) - visible_chars)
