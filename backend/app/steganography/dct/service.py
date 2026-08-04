"""
DCT Steganography Concrete Strategy Implementation.
Coordinates DCT transform, capacity calculation, and steganographic strategy interfaces.
"""

from typing import Dict, Any, Union, Tuple, Optional
from PIL import Image

from app.core.constants import DEFAULT_HEADER_RESERVATION_BITS
from app.models.stego import DCTCapacityResult
from app.steganography.base import EmbeddingStrategy
from app.steganography.dct.capacity import DCTCapacityCalculator
from app.steganography.dct.transform import DCTTransformer
from app.steganography.dct.validator import DCTValidator
from app.steganography.dct.embed import DCTEmbedder


class DCTSteganography(EmbeddingStrategy):
    """
    Concrete EmbeddingStrategy for Discrete Cosine Transform (DCT) frequency domain steganography.
    """

    def __init__(
        self,
        capacity_calculator: Optional[DCTCapacityCalculator] = None,
        transformer: Optional[DCTTransformer] = None,
        validator: Optional[DCTValidator] = None,
        embedder: Optional[DCTEmbedder] = None,
    ):
        self.capacity_calculator = capacity_calculator or DCTCapacityCalculator()
        self.transformer = transformer or DCTTransformer()
        self.validator = validator or DCTValidator(self.capacity_calculator)
        self.embedder = embedder or DCTEmbedder(
            capacity_calculator=self.capacity_calculator,
            transformer=self.transformer,
            validator=self.validator,
        )

    def calculate_capacity(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        bits_per_channel: int = 1,
        header_reserved_bits: int = DEFAULT_HEADER_RESERVATION_BITS,
    ) -> int:
        """
        Calculate usable DCT steganographic bit capacity for image.
        """
        return self.capacity_calculator.calculate_capacity(
            image_input,
            coefficients_per_block=bits_per_channel,
            header_reserved_bits=header_reserved_bits,
        )

    def validate(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int,
        bits_per_channel: int = 1,
        header_reserved_bits: int = DEFAULT_HEADER_RESERVATION_BITS,
    ) -> bool:
        """
        Validate payload feasibility under DCT capacity rules.
        """
        return self.capacity_calculator.validate_capacity(
            image_input,
            payload_bits,
            coefficients_per_block=bits_per_channel,
            header_reserved_bits=header_reserved_bits,
            raise_exception=True,
        )

    def get_capacity_statistics(
        self,
        image_input: Union[bytes, Image.Image, Dict[str, Any]],
        payload_bits: int = 0,
        bits_per_channel: int = 1,
        header_reserved_bits: int = DEFAULT_HEADER_RESERVATION_BITS,
    ) -> DCTCapacityResult:
        """
        Return structured DCTCapacityResult metrics.
        """
        return self.capacity_calculator.get_capacity_statistics(
            image_input,
            payload_bits=payload_bits,
            coefficients_per_block=bits_per_channel,
            header_reserved_bits=header_reserved_bits,
        )

    def embed(
        self,
        cover_image_bytes: bytes,
        payload_data: Any,
        options: Optional[Dict[str, Any]] = None,
    ) -> Tuple[bytes, Dict[str, Any]]:
        """
        Embed binary payload into cover image DCT frequency coefficients.
        """
        result = self.embedder.embed(cover_image_bytes, payload_data, options=options)
        return result.stego_image_bytes, result.model_dump()


    def extract(
        self,
        stego_image_bytes: bytes,
        options: Optional[Dict[str, Any]] = None,
    ) -> Any:
        """
        DCT Payload extraction (Scheduled for Phase 4B.4).
        """
        raise NotImplementedError("DCT Extraction Engine is scheduled for Phase 4B.4.")
