from typing import Generic, TypeVar, Optional, Any, Dict, List
from pydantic import BaseModel, Field
from app.core.enums import StatusType

T = TypeVar("T")


class RootResponse(BaseModel):
    """Root endpoint greeting response schema."""
    message: str = Field(..., json_schema_extra={"example": "Hybrid Image Steganography Backend Running"})


class ErrorDetail(BaseModel):
    code: int = Field(..., description="HTTP or error status code", json_schema_extra={"example": 400})
    message: str = Field(..., description="Human-readable error description", json_schema_extra={"example": "Validation error"})
    type: str = Field(..., description="Error exception type name", json_schema_extra={"example": "RequestValidationError"})
    details: Optional[Any] = Field(None, description="Detailed validation breakdown or trace info")


class ErrorResponse(BaseModel):
    """Standardized JSON error wrapper."""
    error: ErrorDetail


class SuccessResponse(BaseModel, Generic[T]):
    """Generic wrapper for successful operational payloads."""
    status: StatusType = Field(default=StatusType.SUCCESS, description="Operation status indicator")
    message: str = Field(..., description="Operational response summary")
    data: Optional[T] = Field(None, description="Response payload")


class HealthResponse(BaseModel):
    """Service health response schema."""
    status: str = Field(..., json_schema_extra={"example": "healthy"})


class StatusResponse(BaseModel):
    """API online status response schema."""
    backend: str = Field(..., json_schema_extra={"example": "online"})
    version: str = Field(..., json_schema_extra={"example": "1.0.0"})


class VersionResponse(BaseModel):
    """API version information response schema."""
    app_name: str = Field(..., json_schema_extra={"example": "Hybrid Image Steganography System API"})
    version: str = Field(..., json_schema_extra={"example": "1.0.0"})
    api_prefix: str = Field(..., json_schema_extra={"example": "/api/v1"})


class DocsInfoResponse(BaseModel):
    """API documentation URLs response schema."""
    swagger_url: str = Field(..., json_schema_extra={"example": "/docs"})
    redoc_url: str = Field(..., json_schema_extra={"example": "/redoc"})
    openapi_url: str = Field(..., json_schema_extra={"example": "/api/v1/openapi.json"})


class EncodeResponse(BaseModel):
    """Encoding operational response schema."""
    status: StatusType = Field(default=StatusType.NOT_IMPLEMENTED, json_schema_extra={"example": "Not Implemented Yet"})
    message: str = Field(..., json_schema_extra={"example": "Encode endpoint ready."})
    stego_image: Optional[str] = Field(None, description="Base64 encoded output stego image")
    metrics: Optional[Dict[str, Any]] = Field(None, description="Performance and distortion metrics")


class DecodeResponse(BaseModel):
    """Decoding operational response schema."""
    status: StatusType = Field(default=StatusType.NOT_IMPLEMENTED, json_schema_extra={"example": "Not Implemented Yet"})
    message: str = Field(..., json_schema_extra={"example": "Decode endpoint ready."})
    decoded_message: Optional[str] = Field(None, description="Extracted plain text message")


class CompareResponse(BaseModel):
    """Algorithm comparison operational response schema."""
    status: StatusType = Field(default=StatusType.NOT_IMPLEMENTED, json_schema_extra={"example": "Not Implemented Yet"})
    message: str = Field(..., json_schema_extra={"example": "Compare endpoint ready."})
    results: Optional[Dict[str, Any]] = Field(None, description="Comparative benchmark metrics for LSB, DCT, DWT")


class MetricsResponse(BaseModel):
    """Image quality metrics response schema."""
    status: StatusType = Field(default=StatusType.NOT_IMPLEMENTED, json_schema_extra={"example": "Not Implemented Yet"})
    message: str = Field(..., json_schema_extra={"example": "Metrics endpoint ready."})
    metrics: Optional[Dict[str, Any]] = Field(None, description="Calculated PSNR, SSIM, MSE metrics")
