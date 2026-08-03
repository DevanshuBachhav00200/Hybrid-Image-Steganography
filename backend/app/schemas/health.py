from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    message: str = Field(..., json_schema_extra={"example": "Hybrid Image Steganography Backend Running"})


class HealthResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "healthy"})


class StatusResponse(BaseModel):
    backend: str = Field(..., json_schema_extra={"example": "online"})
    version: str = Field(..., json_schema_extra={"example": "1.0.0"})
