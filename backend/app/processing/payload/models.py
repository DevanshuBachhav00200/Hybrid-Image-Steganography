import time
import uuid
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from app.core.enums import PayloadStatus, EmbeddingAlgorithm, StatusType
from app.processing.binary.models import HeaderModel
from app.schemas.upload import ImageMetadata


class PayloadMetadata(BaseModel):
    """Metadata parameters attached to prepared binary payload."""
    algorithm: EmbeddingAlgorithm = Field(default=EmbeddingAlgorithm.AUTO, description="Steganography algorithm")
    payload_length: int = Field(..., description="Payload length in bytes")
    header_length: int = Field(default=16, description="Binary header size in bytes")
    binary_length: int = Field(..., description="Bitstream length in bits")
    estimated_capacity: float = Field(default=0.0, description="Estimated cover image capacity ratio")
    created_at: float = Field(default_factory=time.time, description="Creation timestamp")
    format_version: int = Field(default=1, description="Binary format version")


class PayloadStatistics(BaseModel):
    """Statistical properties of packaged payload."""
    total_bits: int
    total_bytes: int
    header_bits: int
    payload_bits: int
    estimated_embedding_percentage: float = 0.0
    estimated_compression_ratio: float = 1.0
    preparation_time_ms: float = 0.0


class PayloadValidationResult(BaseModel):
    """Result of payload structural and boundary validation."""
    is_valid: bool
    errors: List[str] = Field(default_factory=list)


class Payload(BaseModel):
    """Structured Payload Data Container moving to Embedding Manager."""
    payload_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: float = Field(default_factory=time.time)
    algorithm: EmbeddingAlgorithm = Field(default=EmbeddingAlgorithm.AUTO)
    binary_data: str = Field(..., description="MSB-first binary bitstream string ('0' and '1's)")
    payload_size_bits: int
    payload_size_bytes: int
    header: Optional[HeaderModel] = None
    metadata: PayloadMetadata
    statistics: PayloadStatistics
    status: PayloadStatus = Field(default=PayloadStatus.READY)


class EmbeddingRequest(BaseModel):
    """Request payload sent to Embedding Manager for LSB/DCT/DWT embedding."""
    payload_id: str
    algorithm: EmbeddingAlgorithm
    binary_data: str
    image_metadata: Optional[ImageMetadata] = None


class EmbeddingResponse(BaseModel):
    """Response payload returned from Embedding Manager."""
    status: StatusType = Field(default=StatusType.NOT_IMPLEMENTED)
    message: str = Field(default="Embedding dispatch stage ready.")
    stego_image: Optional[str] = None
