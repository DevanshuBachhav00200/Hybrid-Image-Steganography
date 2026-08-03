from app.core.exceptions import StegoAppException


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
