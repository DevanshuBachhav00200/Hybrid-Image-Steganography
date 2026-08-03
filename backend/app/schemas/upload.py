from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ImageMetadata(BaseModel):
    """Extracted metadata object for uploaded image files."""
    upload_id: str = Field(..., description="Unique generated UUID for upload reference", json_schema_extra={"example": "550e8400-e29b-41d4-a716-446655440000"})
    filename: str = Field(..., description="Original filename of uploaded image", json_schema_extra={"example": "cover_image.png"})
    extension: str = Field(..., description="Normalized uppercase file extension", json_schema_extra={"example": "PNG"})
    width: int = Field(..., description="Image width in pixels", json_schema_extra={"example": 1920})
    height: int = Field(..., description="Image height in pixels", json_schema_extra={"example": 1080})
    channels: int = Field(..., description="Color channels count (e.g. 3 for RGB, 4 for RGBA, 1 for L)", json_schema_extra={"example": 4})
    color_mode: str = Field(..., description="PIL Image color mode (e.g. RGB, RGBA, L)", json_schema_extra={"example": "RGBA"})
    bit_depth: Optional[int] = Field(8, description="Color bit depth per channel", json_schema_extra={"example": 8})
    file_size_bytes: int = Field(..., description="Total byte size of uploaded image", json_schema_extra={"example": 2457600})
    mime_type: str = Field(..., description="Verified MIME type", json_schema_extra={"example": "image/png"})
    upload_time: str = Field(..., description="UTC ISO 8601 upload timestamp", json_schema_extra={"example": "2026-08-03T20:00:00Z"})


class UploadSuccessResponse(BaseModel):
    """Successful image upload response schema."""
    success: bool = Field(True, description="Success status flag")
    upload_id: str = Field(..., description="Generated upload identifier UUID")
    filename: str = Field(..., description="Original image filename")
    metadata: ImageMetadata = Field(..., description="Detailed extracted image metadata")


class UploadErrorDetail(BaseModel):
    code: str = Field(..., description="Error classification string", json_schema_extra={"example": "UNSUPPORTED_FORMAT"})
    message: str = Field(..., description="Detailed user-facing error message", json_schema_extra={"example": "Only PNG and BMP formats are supported."})


class UploadErrorResponse(BaseModel):
    """Validation failure upload response schema."""
    success: bool = Field(False, description="Success status flag")
    error: UploadErrorDetail
