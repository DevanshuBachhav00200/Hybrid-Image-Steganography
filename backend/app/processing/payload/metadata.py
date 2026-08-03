import time
from app.core.enums import EmbeddingAlgorithm
from app.processing.payload.models import PayloadMetadata


def build_embedding_metadata(
    algorithm: EmbeddingAlgorithm,
    payload_length_bytes: int,
    binary_length_bits: int,
    estimated_capacity: float = 0.0,
) -> PayloadMetadata:
    """
    Construct PayloadMetadata object for embedding preparation.
    """
    return PayloadMetadata(
        algorithm=algorithm,
        payload_length=payload_length_bytes,
        header_length=16,
        binary_length=binary_length_bits,
        estimated_capacity=estimated_capacity,
        created_at=time.time(),
        format_version=1,
    )
