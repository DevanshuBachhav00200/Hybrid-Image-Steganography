from app.core.constants import (
    SUPPORTED_ALGORITHMS,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_MESSAGE_LENGTH,
)
from app.core.exceptions import ValidationException


def validate_password_strength(password: str) -> bool:
    """Validate password string length bounds."""
    if not password:
        raise ValidationException("Password cannot be empty.")
    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValidationException(f"Password must be at least {MIN_PASSWORD_LENGTH} characters long.")
    if len(password) > MAX_PASSWORD_LENGTH:
        raise ValidationException(f"Password exceeds maximum length of {MAX_PASSWORD_LENGTH} characters.")
    return True


def validate_algorithm_type(algorithm: str) -> bool:
    """Validate algorithm string against supported algorithms list."""
    if not algorithm or algorithm.upper() not in SUPPORTED_ALGORITHMS:
        raise ValidationException(
            f"Unsupported algorithm '{algorithm}'. Supported algorithms: {', '.join(SUPPORTED_ALGORITHMS)}"
        )
    return True


def validate_message_length(message: str) -> bool:
    """Validate plain text message payload length."""
    if not message or not message.strip():
        raise ValidationException("Message payload cannot be empty.")
    if len(message) > MAX_MESSAGE_LENGTH:
        raise ValidationException(f"Message payload exceeds maximum length of {MAX_MESSAGE_LENGTH} characters.")
    return True
