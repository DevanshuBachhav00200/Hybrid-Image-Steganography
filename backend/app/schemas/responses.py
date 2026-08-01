from pydantic import BaseModel, Field
from typing import Any, Optional, Dict

class BaseStatusResponse(BaseModel):
    status: str = Field("Coming Soon", description="Operation status indicator")

class HealthCheckResponse(BaseStatusResponse):
    app_name: str = "Hybrid Image Steganography System"
    version: str = "1.0.0"
    status: str = "Coming Soon"

class VersionResponse(BaseStatusResponse):
    version: str = "1.0.0"
    api_prefix: str = "/api"
    status: str = "Coming Soon"

class AlgorithmInfo(BaseModel):
    id: str
    name: str
    domain: str
    description: str

class AlgorithmsResponse(BaseStatusResponse):
    algorithms: list[AlgorithmInfo] = []
    status: str = "Coming Soon"

class EncodeResponse(BaseStatusResponse):
    job_id: Optional[str] = None
    stego_image_url: Optional[str] = None
    status: str = "Coming Soon"

class DecodeResponse(BaseStatusResponse):
    extracted_message: Optional[str] = None
    status: str = "Coming Soon"

class CompareResponse(BaseStatusResponse):
    psnr: Optional[float] = None
    ssim: Optional[float] = None
    mse: Optional[float] = None
    histogram_diff: Optional[Dict[str, Any]] = None
    status: str = "Coming Soon"

class MetricsResponse(BaseStatusResponse):
    metrics: Dict[str, Any] = Field(default_factory=dict)
    status: str = "Coming Soon"
