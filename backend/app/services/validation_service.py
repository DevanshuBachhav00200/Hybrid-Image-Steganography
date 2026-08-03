from typing import Any
from app.utils.validation_utils import (
    validate_message_length,
    validate_password_strength,
    validate_algorithm_type,
)
from app.core.exceptions import ValidationException
from app.core.logging import logger


class ValidationService:
    """
    Service providing domain validation for messages, passwords, algorithms, images, and requests.
    """

    def validate_message(self, message: str) -> bool:
        """Validate plain text message constraints."""
        logger.info("Executing ValidationService.validate_message()")
        return validate_message_length(message)

    def validate_password(self, password: str) -> bool:
        """Validate AES password strength rules."""
        logger.info("Executing ValidationService.validate_password()")
        return validate_password_strength(password)

    def validate_algorithm(self, algorithm: str) -> bool:
        """Validate steganographic algorithm choice."""
        logger.info("Executing ValidationService.validate_algorithm()")
        return validate_algorithm_type(algorithm)

    def validate_image(self, image_data: str) -> bool:
        """Validate base64 image data present."""
        logger.info("Executing ValidationService.validate_image()")
        if not image_data or not image_data.strip():
            raise ValidationException("Image payload cannot be empty.")
        return True

    def validate_request(self, payload: Any) -> bool:
        """Validate composite operation request."""
        logger.info("Executing ValidationService.validate_request()")
        if payload is None:
            raise ValidationException("Request payload cannot be None.")
        return True
