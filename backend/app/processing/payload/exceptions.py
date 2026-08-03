from app.core.exceptions import StegoAppException


class PayloadException(StegoAppException):
    """Base exception for all payload building and preparation errors."""
    pass


class PayloadValidationException(PayloadException):
    """Raised when payload structure, binary bitstream, or metadata validation fails."""
    pass


class CapacityException(PayloadException):
    """Raised when payload size exceeds cover image steganographic capacity."""
    pass


class EmbeddingPreparationException(PayloadException):
    """Raised when embedding request preparation fails."""
    pass


class AlgorithmSelectionException(PayloadException):
    """Raised when auto-algorithm selection or requested steganography algorithm is invalid."""
    pass
