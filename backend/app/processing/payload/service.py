from typing import Dict, Optional
from app.core.enums import PayloadStatus, EmbeddingAlgorithm
from app.schemas.upload import ImageMetadata
from app.processing.payload.interfaces import PayloadInterface
from app.processing.payload.models import (
    Payload,
    PayloadStatistics,
    PayloadValidationResult,
    EmbeddingRequest,
)
from app.processing.payload.builder import PayloadBuilder
from app.processing.payload.validator import validate_payload_structure
from app.processing.payload.statistics import calculate_statistics
from app.processing.payload.capacity import CapacityEstimator
from app.processing.payload.embedding_manager import EmbeddingManager


class PayloadService(PayloadInterface):
    """
    Production-ready Payload Service coordinating payload packaging, validation,
    statistics calculation, capacity estimation, and embedding request preparation.
    """

    def __init__(self):
        self.builder = PayloadBuilder()
        self.embedding_manager = EmbeddingManager()
        self.capacity_estimator = CapacityEstimator()

    def build(self, binary_bitstream: str, algorithm: EmbeddingAlgorithm = EmbeddingAlgorithm.AUTO) -> Payload:
        """Package binary bitstream into structured Payload container object."""
        return self.builder.build(binary_bitstream, algorithm)

    def prepare(self, payload: Payload, image_metadata: Optional[ImageMetadata] = None) -> EmbeddingRequest:
        """Prepare EmbeddingRequest container object for EmbeddingManager."""
        return self.embedding_manager.prepare_embedding(payload, image_metadata)

    def validate(self, binary_bitstream: str) -> PayloadValidationResult:
        """Validate binary bitstream string structure and boundary rules."""
        return validate_payload_structure(binary_bitstream)

    def calculate_statistics(self, binary_bitstream: str, preparation_time_ms: float = 0.0) -> PayloadStatistics:
        """Calculate statistical metrics for binary bitstream."""
        return calculate_statistics(binary_bitstream, preparation_time_ms)

    def estimate_capacity(self, image_metadata: Optional[ImageMetadata] = None) -> Dict[str, int]:
        """Estimate steganographic embedding capacity across algorithms."""
        return self.capacity_estimator.estimate_best(image_metadata)

    def finalize(self, payload: Payload) -> Payload:
        """Finalize payload status to PREPARED before dispatch."""
        payload.status = PayloadStatus.PREPARED
        return payload
