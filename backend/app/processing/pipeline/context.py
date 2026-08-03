import time
import uuid
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.core.enums import AlgorithmType, PipelineStatus
from app.schemas.requests import EncodeRequest
from app.schemas.upload import ImageMetadata
from app.processing.payload.models import Payload, PayloadMetadata


class PipelineContext(BaseModel):
    """
    Enhanced Context container object moving through every pipeline stage.
    Maintains telemetry, stage history, intermediate buffers, errors, and performance metrics.
    """
    pipeline_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique pipeline instance ID")
    execution_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique execution run ID")
    request: Optional[EncodeRequest] = Field(None, description="Input encoding request payload")
    metadata: Optional[ImageMetadata] = Field(None, description="Target cover/stego image metadata")
    payload_metadata: Optional[PayloadMetadata] = Field(None, description="Prepared binary payload metadata")
    current_stage: str = Field("INITIALIZATION", description="Active pipeline stage name")
    previous_stage: Optional[str] = Field(None, description="Previous pipeline stage name")
    algorithm: Optional[AlgorithmType] = Field(None, description="Selected steganography algorithm")
    status: PipelineStatus = Field(PipelineStatus.CREATED, description="Pipeline state machine status")
    temp_data: Dict[str, Any] = Field(default_factory=dict, description="Intermediate stage data exchange buffer")
    errors: List[str] = Field(default_factory=list, description="Logged stage errors")
    warnings: List[str] = Field(default_factory=list, description="Logged stage warnings")
    start_time: float = Field(default_factory=time.time, description="Pipeline initiation timestamp")
    end_time: Optional[float] = Field(None, description="Pipeline completion timestamp")
    execution_time_ms: Optional[float] = Field(None, description="Total pipeline execution duration in ms")
    stage_history: List[Dict[str, Any]] = Field(default_factory=list, description="Detailed stage execution history and timings")

    def advance_stage(self, next_stage: str, status: PipelineStatus = PipelineStatus.PROCESSING) -> None:
        """Advance pipeline to next stage and record previous stage state."""
        self.previous_stage = self.current_stage
        self.current_stage = next_stage
        self.status = status

    def record_stage_telemetry(self, stage_name: str, duration_ms: float, status: str = "COMPLETED") -> None:
        """Record stage execution duration and status in stage_history log."""
        self.stage_history.append({
            "stage": stage_name,
            "status": status,
            "duration_ms": round(duration_ms, 2),
            "timestamp": time.time(),
        })

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


class PipelineResult(BaseModel):
    """
    Standardized result model returned upon completion of pipeline execution.
    """
    success: bool = Field(..., description="Whether pipeline completed without fatal errors")
    pipeline_id: str = Field(..., description="Pipeline execution identifier")
    execution_time_ms: float = Field(..., description="Total execution time in milliseconds")
    completed_stages: List[str] = Field(default_factory=list, description="List of successfully executed stages")
    failed_stage: Optional[str] = Field(None, description="Name of stage that triggered failure if applicable")
    payload: Optional[Payload] = Field(None, description="Prepared Payload object")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Metadata summary")
    warnings: List[str] = Field(default_factory=list, description="Pipeline execution warnings")
    errors: List[str] = Field(default_factory=list, description="Pipeline execution errors")
