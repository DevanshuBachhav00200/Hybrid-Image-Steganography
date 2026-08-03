from enum import Enum


class AlgorithmType(str, Enum):
    """Supported steganography algorithms."""
    LSB = "LSB"
    DCT = "DCT"
    DWT = "DWT"


class EmbeddingAlgorithm(str, Enum):
    """Supported steganography embedding algorithms including auto-selection."""
    LSB = "LSB"
    DCT = "DCT"
    DWT = "DWT"
    AUTO = "AUTO"


class OperationType(str, Enum):
    """Supported steganography operations."""
    ENCODE = "ENCODE"
    DECODE = "DECODE"
    COMPARE = "COMPARE"


class StatusType(str, Enum):
    """Standard operation and endpoint status types."""
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    PENDING = "PENDING"
    READY = "READY"
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED"


class UploadStatus(str, Enum):
    """Temporary upload file status indicator."""
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    PENDING = "PENDING"
    EXPIRED = "EXPIRED"


class PipelineStatus(str, Enum):
    """Pipeline execution lifecycle status state machine."""
    CREATED = "CREATED"
    VALIDATING = "VALIDATING"
    PREPARING = "PREPARING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class PayloadStatus(str, Enum):
    """Payload preparation status lifecycle."""
    READY = "READY"
    INVALID = "INVALID"
    PREPARED = "PREPARED"
    FAILED = "FAILED"
