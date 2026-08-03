from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.processing.binary.constants import (
    MAGIC_NUMBER,
    FORMAT_VERSION,
    ALGORITHM_ID_AES_GCM,
    HEADER_SIZE_BYTES,
    BIT_ORDERING,
)


class HeaderModel(BaseModel):
    """Model representing binary header layout."""
    magic_number: bytes = Field(default=MAGIC_NUMBER, description="Magic bytes identifier (b'STEGO')")
    version: int = Field(default=FORMAT_VERSION, description="Binary format version")
    algorithm_id: int = Field(default=ALGORITHM_ID_AES_GCM, description="Algorithm ID (1=AES-256-GCM)")
    payload_length: int = Field(..., description="Payload length in bytes excluding header")
    header_size: int = Field(default=HEADER_SIZE_BYTES, description="Fixed header size in bytes (16)")
    checksum: int = Field(..., description="CRC16 checksum over binary payload")


class BinaryPayload(BaseModel):
    """Model representing unpacked binary payload components."""
    header: HeaderModel
    nonce: bytes
    salt: bytes
    authentication_tag: bytes
    ciphertext: bytes


class BitStreamModel(BaseModel):
    """Model holding serialized binary bitstream string and metrics."""
    bitstream: str = Field(..., description="Binary string sequence of '0' and '1's")
    total_bits: int = Field(..., description="Total length of bitstream")
    total_bytes: int = Field(..., description="Total length in bytes")
    bit_ordering: str = Field(default=BIT_ORDERING, description="Bit ordering convention (MSB)")


class PayloadMetadata(BaseModel):
    """Metadata summary of binary serialization."""
    payload_bytes_length: int
    total_bitstream_length: int
    algorithm_name: str = "AES-256-GCM"


class BinaryStatistics(BaseModel):
    """Statistical distribution metrics of bitstream."""
    ones_count: int
    zeros_count: int
    bit_density: float
