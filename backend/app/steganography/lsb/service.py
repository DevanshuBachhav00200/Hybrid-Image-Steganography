"""
LSB Steganography Concrete Strategy Implementation.
Integrates LSBCapacityCalculator, LSBValidator, LSBEmbedder, and LSBExtractor.
"""

from typing import Dict, Any, Tuple, Optional
from app.steganography.base import EmbeddingStrategy
from app.steganography.lsb.capacity import LSBCapacityCalculator
from app.steganography.lsb.embed import LSBEmbedder
from app.steganography.lsb.extract import LSBExtractor
from app.models.stego import LSBCapacityResult


class LSBSteganography(EmbeddingStrategy):
    """
    Concrete implementation of EmbeddingStrategy for Spatial Domain LSB Steganography.
    """

    def __init__(self, capacity_calculator: Optional[LSBCapacityCalculator] = None):
        self.capacity_calculator = capacity_calculator or LSBCapacityCalculator()
        self.embedder = LSBEmbedder()
        self.extractor = LSBExtractor()

    def calculate_capacity(
        self,
        image_input: Any,
        bits_per_channel: int = 1,
        header_reserved_bits: int = 256
    ) -> int:
        return self.capacity_calculator.calculate_capacity(
            image_input, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
        )

    def validate(
        self,
        image_input: Any,
        payload_bits: int,
        bits_per_channel: int = 1,
        header_reserved_bits: int = 256
    ) -> bool:
        return self.capacity_calculator.can_embed_payload(
            image_input, payload_bits, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
        )

    def get_capacity_statistics(
        self,
        image_input: Any,
        payload_bits: int = 0,
        bits_per_channel: int = 1,
        header_reserved_bits: int = 256
    ) -> LSBCapacityResult:
        return self.capacity_calculator.get_capacity_statistics(
            image_input, payload_bits=payload_bits, bits_per_channel=bits_per_channel, header_reserved_bits=header_reserved_bits
        )

    def embed(
        self,
        cover_image_bytes: bytes,
        payload_data: Any,
        options: Optional[Dict[str, Any]] = None
    ) -> Tuple[bytes, Dict[str, Any]]:
        result = self.embedder.embed(cover_image_bytes, payload_data, options=options)
        return result.stego_image_bytes, result.model_dump()


    def extract(
        self,
        stego_image_bytes: bytes,
        options: Optional[Dict[str, Any]] = None
    ) -> Any:
        return self.extractor.extract(stego_image_bytes, options=options)
