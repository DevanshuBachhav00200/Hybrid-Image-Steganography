from enum import Enum
from typing import Dict, Any, Tuple, List

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


class LSBEmbeddingResult(BaseModel):
    """
    Structured response model returned after successful LSB steganographic embedding.
    """
    stego_image_bytes: bytes
    image_width: int
    image_height: int
    channels: int
    color_mode: str
    format: str
    payload_size_bits: int
    payload_size_bytes: int
    capacity_bits: int
    capacity_used_percentage: float
    remaining_capacity_bits: int
    pixels_modified: int
    execution_time_ms: float
    success: bool


class LSBExtractionResult(BaseModel):

    """
    Structured response model returned after successful LSB steganographic payload extraction.
    """
    recovered_payload: str
    payload_size_bits: int
    payload_size_bytes: int
    header_info: Dict[str, Any]
    extraction_time_ms: float
    success: bool
    image_metadata: Dict[str, Any]


ExtractedPayload = LSBExtractionResult


class DCTCapacityResult(BaseModel):
    """
    Structured model containing detailed DCT capacity analysis and payload feasibility metrics.
    """
    image_width: int
    image_height: int
    padded_width: int
    padded_height: int
    channels: int
    total_pixels: int
    color_mode: str
    total_8x8_blocks: int
    coefficients_per_block: int
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


class DCTTransformResult(BaseModel):
    """
    Structured model containing DCT 8x8 block transform and padding metadata.
    """
    image_width: int
    image_height: int
    padded_width: int
    padded_height: int
    padding_x: int
    padding_y: int
    channels: int
    color_mode: str
    format: str
    total_blocks: int
    blocks_shape: Tuple[int, int, int, int]
    transform_execution_time_ms: float
    success: bool


class DCTEmbeddingResult(BaseModel):
    """
    Structured response model returned after successful DCT steganographic payload embedding.
    """
    stego_image_bytes: bytes
    payload_size_bits: int
    payload_size_bytes: int
    usable_capacity_bits: int
    capacity_used_percentage: float
    remaining_capacity_bits: int
    coefficients_modified: int
    total_blocks_processed: int
    coefficients_per_block: int
    quantization_step: float
    psnr_db: float
    mse: float
    embedding_time_ms: float
    format: str
    color_mode: str
    dimensions: Tuple[int, int]
    success: bool


class DCTExtractionResult(BaseModel):

    """
    Structured response model returned after successful DCT steganographic payload extraction.
    """
    recovered_payload: str
    payload_size_bits: int
    payload_size_bytes: int
    header_info: Dict[str, Any]
    coefficients_read: int
    total_blocks_scanned: int
    quantization_step: float
    extraction_time_ms: float
    success: bool
    image_metadata: Dict[str, Any]


class DWTCapacityResult(BaseModel):
    """
    Structured response model returned by DWT Capacity Calculator.
    """
    total_coefficients: int
    header_reserved_bits: int
    usable_capacity_bits: int
    usable_capacity_bytes: int
    payload_size_bits: int
    remaining_capacity_bits: int
    capacity_used_percentage: float
    wavelet_family: str
    decomposition_level: int
    selected_subbands: List[str]
    dimensions: Tuple[int, int]
    color_mode: str
    success: bool


class DWTTransformResult(BaseModel):
    """
    Structured response model returned after forward DWT decomposition.
    """
    wavelet_family: str
    decomposition_level: int
    subbands_info: Dict[str, Any]
    transform_execution_time_ms: float
    validation_status: bool
    image_metadata: Dict[str, Any]


class DWTEmbeddingResult(BaseModel):
    """
    Structured response model returned by DWT Embedding Engine.
    """
    stego_image_bytes: bytes
    payload_size_bits: int
    payload_size_bytes: int
    usable_capacity_bits: int
    capacity_used_percentage: float
    remaining_capacity_bits: int
    coefficients_modified: int
    total_coefficients: int
    wavelet_family: str
    decomposition_level: int
    selected_subbands: List[str]
    psnr_db: float
    mse: float
    embedding_time_ms: float
    format: str
    color_mode: str
    dimensions: Tuple[int, int]
    success: bool


class DWTExtractionResult(BaseModel):
    """
    Structured response model returned after successful DWT steganographic payload extraction.
    """
    recovered_payload: str
    payload_size_bits: int
    payload_size_bytes: int
    header_info: Dict[str, Any]
    coefficients_read: int
    total_coefficients: int
    wavelet_family: str
    decomposition_level: int
    selected_subbands: List[str]
    quantization_step: float
    extraction_time_ms: float
    success: bool
    image_metadata: Dict[str, Any]









