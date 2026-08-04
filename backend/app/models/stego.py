from enum import Enum
from pydantic import BaseModel

class StegoDomain(str, Enum):
    LSB = "LSB"
    DCT = "DCT"
    DWT = "DWT"
    HYBRID = "HYBRID"

class EncryptionMethod(str, Enum):
    NONE = "NONE"
    AES_256 = "AES_256"

class TextEncodingMethod(str, Enum):
    PLAIN = "PLAIN"
    MORSE = "MORSE"

class StegoJobStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class LSBCapacityResult(BaseModel):
    """
    Structured model containing detailed capacity analysis and payload feasibility metrics.
    """
    image_width: int
    image_height: int
    channels: int
    total_pixels: int
    color_mode: str
    bits_per_channel: int
    total_capacity_bits: int
    total_capacity_bytes: int
    header_reserved_bits: int
    usable_capacity_bits: int
    usable_capacity_bytes: int
    payload_size_bits: int
    payload_size_bytes: int
    remaining_capacity_bits: int
    remaining_capacity_bytes: int
    utilization_percentage: float
    can_embed: bool

