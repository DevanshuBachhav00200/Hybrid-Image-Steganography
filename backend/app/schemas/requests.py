from pydantic import BaseModel, Field, field_validator
from app.core.enums import AlgorithmType


class EncodeRequest(BaseModel):
    """
    Request schema for image encoding operation.
    """
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Plain text message to encode into image",
        json_schema_extra={"example": "Secret message to embed"}
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="AES encryption password (minimum 8 characters)",
        json_schema_extra={"example": "StrongPassword123!"}
    )
    algorithm: AlgorithmType = Field(
        ...,
        description="Steganography algorithm choice (LSB, DCT, or DWT)",
        json_schema_extra={"example": "LSB"}
    )
    image: str = Field(
        ...,
        min_length=1,
        description="Base64 encoded string of original cover image",
        json_schema_extra={"example": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}
    )

    @field_validator("image")
    def validate_image_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Image field cannot be empty or blank")
        return v


class DecodeRequest(BaseModel):
    """
    Request schema for stego image decoding operation.
    """
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="AES decryption password (minimum 8 characters)",
        json_schema_extra={"example": "StrongPassword123!"}
    )
    algorithm: AlgorithmType = Field(
        ...,
        description="Steganography algorithm choice (LSB, DCT, or DWT)",
        json_schema_extra={"example": "LSB"}
    )
    image: str = Field(
        ...,
        min_length=1,
        description="Base64 encoded string of stego image",
        json_schema_extra={"example": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}
    )

    @field_validator("image")
    def validate_image_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Image field cannot be empty or blank")
        return v


class CompareRequest(BaseModel):
    """
    Request schema for algorithm comparison operation.
    """
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Message payload to evaluate across all algorithms",
        json_schema_extra={"example": "Benchmark test payload"}
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="AES encryption password (minimum 8 characters)",
        json_schema_extra={"example": "StrongPassword123!"}
    )
    image: str = Field(
        ...,
        min_length=1,
        description="Base64 encoded string of test cover image",
        json_schema_extra={"example": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}
    )


class MetricsRequest(BaseModel):
    """
    Request schema for retrieving specific operation metrics.
    """
    operation_id: str = Field(
        ...,
        min_length=1,
        description="Unique operation ID to query image quality metrics for",
        json_schema_extra={"example": "op_987654321"}
    )
