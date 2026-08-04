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


class AESCryptoException(StegoAppException):
    """Base exception for all AES cryptographic processing errors."""
    pass


class EncryptionException(AESCryptoException):
    """Raised when AES-GCM encryption fails."""
    pass


class DecryptionException(AESCryptoException):
    """Raised when AES-GCM decryption fails."""
    pass


class KeyDerivationException(AESCryptoException):
    """Raised when PBKDF2 key derivation fails."""
    pass


class AuthenticationException(AESCryptoException):
    """Raised when AES-GCM authentication tag verification fails."""
    def __init__(self, message: str = "MAC authentication check failed. Invalid password or data tampered."):
        super().__init__(message)


class WeakPasswordException(AESCryptoException):
    """Raised when password policy validation fails."""
    def __init__(self, message: str = "Password does not meet minimum security requirements."):
        super().__init__(message)


class InvalidCiphertextException(AESCryptoException):
    """Raised when ciphertext payload structure or data is invalid."""
    pass


class BinaryConversionException(StegoAppException):
    """Base exception for binary bitstream conversion errors."""
    pass


class InvalidHeaderException(BinaryConversionException):
    """Raised when binary header magic number, version, or format is invalid."""
    pass


class InvalidBitstreamException(BinaryConversionException):
    """Raised when bitstream length or bit values ('0'/'1') are malformed."""
    pass


class SerializationException(BinaryConversionException):
    """Raised when AES payload to binary serialization fails."""
    pass


class DeserializationException(BinaryConversionException):
    """Raised when binary bitstream to AES payload deserialization fails."""
    pass


class PayloadLengthException(BinaryConversionException):
    """Raised when payload length mismatch occurs during header parsing."""
    pass


class ChecksumException(BinaryConversionException):
    """Raised when binary payload CRC checksum verification fails."""
    def __init__(self, message: str = "Binary payload CRC checksum mismatch. Payload corrupted."):
        super().__init__(message)


class PayloadException(StegoAppException):
    """Base exception for all payload building and preparation errors."""
    pass


class PayloadValidationException(PayloadException):
    """Raised when payload structure, binary bitstream, or metadata validation fails."""
    pass


class CapacityException(PayloadException):
    """Raised when payload size exceeds cover image steganographic capacity."""
    pass


class CapacityCalculationException(StegoAppException):
    """Raised when steganographic capacity calculation fails due to image or input invalidity."""
    pass


class PayloadTooLargeException(CapacityException):
    """Raised when payload size in bits exceeds available steganographic capacity."""
    pass



class EmbeddingPreparationException(PayloadException):
    """Raised when embedding request preparation fails."""
    pass


class AlgorithmSelectionException(PayloadException):
    """Raised when auto-algorithm selection or requested steganography algorithm is invalid."""
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
