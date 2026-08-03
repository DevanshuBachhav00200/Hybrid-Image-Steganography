"""
Custom domain exception hierarchy for Hybrid Image Steganography System.
"""

class StegoAppException(Exception):
    """Base exception for all application-specific errors."""
    def __init__(self, message: str, details: str = None):
        super().__init__(message)
        self.message = message
        self.details = details


class ValidationException(StegoAppException):
    """Raised when input validation fails."""
    pass


class ImageException(StegoAppException):
    """Raised when image processing or format validation fails."""
    pass


class EncodingException(StegoAppException):
    """Raised when steganographic encoding or encryption fails."""
    pass


class DecodingException(StegoAppException):
    """Raised when steganographic extraction or decryption fails."""
    pass


class MetricsException(StegoAppException):
    """Raised when quality metric evaluation fails."""
    pass


class ConfigurationException(StegoAppException):
    """Raised when application configuration or settings are invalid."""
    pass
