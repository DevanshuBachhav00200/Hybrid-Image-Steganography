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
    """Base exception for image processing or format validation failures."""
    pass


class InvalidImageException(ImageException):
    """Raised when uploaded file is not a valid image or is structurally invalid."""
    pass


class CorruptedImageException(ImageException):
    """Raised when an image file header or pixel data is corrupted."""
    pass


class UnsupportedFormatException(ImageException):
    """Raised when image format (e.g. JPEG, WEBP, GIF) is not supported (PNG & BMP only)."""
    pass


class ImageTooLargeException(ImageException):
    """Raised when uploaded image byte size exceeds maximum allowed limit."""
    pass


class ImageDimensionException(ImageException):
    """Raised when image width, height, or megapixels violate dimension boundaries."""
    pass


class UploadFailedException(ImageException):
    """Raised when file save or upload processing fails."""
    pass


class PipelineException(StegoAppException):
    """Base exception for pipeline execution errors."""
    pass


class PipelineStageException(PipelineException):
    """Raised when a specific pipeline stage execution fails."""
    def __init__(self, stage_name: str, message: str, details: str = None):
        super().__init__(f"Stage '{stage_name}' failed: {message}", details=details)
        self.stage_name = stage_name


class PipelineTimeoutException(PipelineException):
    """Raised when pipeline execution exceeds maximum timeout limit."""
    pass


class MorseException(StegoAppException):
    """Base exception for all Morse code processing errors."""
    pass


class UnsupportedCharacterException(MorseException):
    """Raised when text contains a character not supported by Morse Code dictionary."""
    def __init__(self, character: str):
        super().__init__(f"Unsupported character '{character}' in Morse input.")
        self.character = character


class InvalidMorseCodeException(MorseException):
    """Raised when Morse string contains an unrecognized dot/dash sequence."""
    def __init__(self, sequence: str):
        super().__init__(f"Unrecognized Morse code sequence '{sequence}'.")
        self.sequence = sequence


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
