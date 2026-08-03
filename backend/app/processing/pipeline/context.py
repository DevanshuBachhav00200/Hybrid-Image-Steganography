import time
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.core.enums import AlgorithmType, PipelineStatus
from app.schemas.requests import EncodeRequest
from app.schemas.upload import ImageMetadata


class PipelineContext(BaseModel):
    """
    Context container object moving through every pipeline stage.
    Maintains state, intermediate stage data, error logs, and performance metrics.
    """
    request: Optional[EncodeRequest] = Field(None, description="Input encoding request payload")
    metadata: Optional[ImageMetadata] = Field(None, description="Target cover/stego image metadata")
    current_stage: str = Field("INITIALIZATION", description="Name of active pipeline stage")
    algorithm: Optional[AlgorithmType] = Field(None, description="Selected steganography algorithm (LSB, DCT, DWT)")
    status: PipelineStatus = Field(PipelineStatus.CREATED, description="Pipeline state machine status")
    temp_data: Dict[str, Any] = Field(default_factory=dict, description="Intermediate data exchange buffer between stages")
    errors: List[str] = Field(default_factory=list, description="Logged stage errors or warnings")
    start_time: float = Field(default_factory=time.time, description="Pipeline initiation timestamp")
    end_time: Optional[float] = Field(None, description="Pipeline completion timestamp")
    execution_time_ms: Optional[float] = Field(None, description="Total pipeline processing duration in ms")

    def advance_stage(self, next_stage: str, status: PipelineStatus = PipelineStatus.PROCESSING) -> None:
        """Advance pipeline to next stage and update status."""
        self.current_stage = next_stage
        self.status = status

    def complete(self) -> None:
        """Mark pipeline execution as completed and calculate total duration."""
        self.end_time = time.time()
        self.execution_time_ms = round((self.end_time - self.start_time) * 1000, 2)
        self.status = PipelineStatus.COMPLETED

    def fail(self, error_message: str) -> None:
        """Mark pipeline execution as failed and log error."""
        self.end_time = time.time()
        self.execution_time_ms = round((self.end_time - self.start_time) * 1000, 2)
        self.status = PipelineStatus.FAILED
        self.errors.append(error_message)

    model_config = {"arbitrary_types_allowed": True}
