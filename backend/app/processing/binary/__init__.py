"""
Binary Conversion Package.
"""
from app.processing.binary.interfaces import BinaryInterface
from app.processing.binary.service import BinaryService
from app.processing.binary.models import (
    HeaderModel,
    BinaryPayload,
    BitStreamModel,
    PayloadMetadata,
    BinaryStatistics,
)
from app.processing.binary.exceptions import (
    BinaryConversionException,
    InvalidHeaderException,
    InvalidBitstreamException,
    SerializationException,
    DeserializationException,
    PayloadLengthException,
    ChecksumException,
)
from app.processing.binary.constants import (
    MAGIC_NUMBER,
    FORMAT_VERSION,
    HEADER_SIZE_BYTES,
    BIT_ORDERING,
)

__all__ = [
    "BinaryInterface",
    "BinaryService",
    "HeaderModel",
    "BinaryPayload",
    "BitStreamModel",
    "PayloadMetadata",
    "BinaryStatistics",
    "BinaryConversionException",
    "InvalidHeaderException",
    "InvalidBitstreamException",
    "SerializationException",
    "DeserializationException",
    "PayloadLengthException",
    "ChecksumException",
    "MAGIC_NUMBER",
    "FORMAT_VERSION",
    "HEADER_SIZE_BYTES",
    "BIT_ORDERING",
]
