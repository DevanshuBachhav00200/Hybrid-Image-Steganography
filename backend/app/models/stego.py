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
