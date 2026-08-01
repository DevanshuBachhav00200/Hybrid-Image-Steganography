from pydantic import BaseModel, Field
from typing import Optional
from app.models.stego import StegoDomain, EncryptionMethod, TextEncodingMethod

class EncodeRequest(BaseModel):
    secret_message: str = Field(..., description="Secret text payload to hide in cover image")
    passphrase: Optional[str] = Field(None, description="Optional AES encryption passphrase")
    domain: StegoDomain = Field(StegoDomain.LSB, description="Embedding domain target")
    use_morse: bool = Field(True, description="Enable Morse code pre-encoding")
    use_aes: bool = Field(True, description="Enable AES-256 encryption")

class DecodeRequest(BaseModel):
    passphrase: Optional[str] = Field(None, description="Optional AES encryption passphrase")
    domain: StegoDomain = Field(StegoDomain.LSB, description="Embedding domain target")
    use_morse: bool = Field(True, description="Enable Morse code pre-decoding")
    use_aes: bool = Field(True, description="Enable AES-256 decryption")

class CompareRequest(BaseModel):
    metrics: Optional[list[str]] = Field(default=["psnr", "ssim", "mse"], description="List of metrics to compute")

class MetricsRequest(BaseModel):
    calculate_psnr: bool = True
    calculate_ssim: bool = True
    calculate_mse: bool = True
