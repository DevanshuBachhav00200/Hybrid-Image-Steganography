"""
Pydantic schemas for request validation and standardized API responses.
"""
from app.schemas.health import RootResponse, HealthResponse as LegacyHealthResponse
from app.schemas.requests import EncodeRequest, DecodeRequest, CompareRequest, MetricsRequest
from app.schemas.responses import (
    SuccessResponse,
    ErrorResponse,
    HealthResponse,
    StatusResponse,
    VersionResponse,
    DocsInfoResponse,
    EncodeResponse,
    DecodeResponse,
    CompareResponse,
    MetricsResponse,
)

__all__ = [
    "RootResponse",
    "EncodeRequest",
    "DecodeRequest",
    "CompareRequest",
    "MetricsRequest",
    "SuccessResponse",
    "ErrorResponse",
    "HealthResponse",
    "StatusResponse",
    "VersionResponse",
    "DocsInfoResponse",
    "EncodeResponse",
    "DecodeResponse",
    "CompareResponse",
    "MetricsResponse",
]
