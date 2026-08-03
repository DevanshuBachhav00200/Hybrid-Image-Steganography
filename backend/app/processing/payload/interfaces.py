from abc import ABC, abstractmethod
from typing import Dict, Optional
from app.core.enums import EmbeddingAlgorithm
from app.schemas.upload import ImageMetadata
from app.processing.payload.models import (
    Payload,
    PayloadStatistics,
    PayloadValidationResult,
    EmbeddingRequest,
)


class PayloadInterface(ABC):
    """
    Abstract Interface for Payload Builder and Embedding Preparation.
    """

    @abstractmethod
    def build(self, binary_bitstream: str, algorithm: EmbeddingAlgorithm = EmbeddingAlgorithm.AUTO) -> Payload:
        """Package raw binary bitstream string into validated Payload object."""
        pass

    @abstractmethod
    def prepare(self, payload: Payload, image_metadata: Optional[ImageMetadata] = None) -> EmbeddingRequest:
        """Prepare EmbeddingRequest object for EmbeddingManager."""
        pass

    @abstractmethod
    def validate(self, binary_bitstream: str) -> PayloadValidationResult:
        """Validate binary bitstream structure and boundary rules."""
        pass

    @abstractmethod
    def calculate_statistics(self, binary_bitstream: str, preparation_time_ms: float = 0.0) -> PayloadStatistics:
        """Calculate statistical metrics for binary bitstream."""
        pass

    @abstractmethod
    def estimate_capacity(self, image_metadata: Optional[ImageMetadata] = None) -> Dict[str, int]:
        """Estimate steganographic embedding capacity across algorithms."""
        pass

    @abstractmethod
    def finalize(self, payload: Payload) -> Payload:
        """Finalize payload status and parameters before dispatch."""
        pass
