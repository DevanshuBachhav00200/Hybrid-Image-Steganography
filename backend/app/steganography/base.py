"""
Abstract Strategy Interface for Steganography Algorithms.
Defines the technical contract for LSB, DCT, DWT, and future embedding strategies.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple, Optional
from app.models.stego import LSBCapacityResult


class EmbeddingStrategy(ABC):
    """
    Abstract Base Class defining the strategy contract for steganographic embedding and extraction algorithms.
    """

    @abstractmethod
    def calculate_capacity(
        self,
        image_input: Any,
        bits_per_channel: int = 1,
        header_reserved_bits: int = 256
    ) -> int:
        """
        Calculate usable steganographic embedding capacity in bits.

        :param image_input: Raw image bytes, PIL Image, or image metadata dict.
        :param bits_per_channel: Bit depth for embedding per pixel channel.
        :param header_reserved_bits: Reserved bits for steganography header & metadata.
        :return: Usable bit capacity (integer).
        """
        pass

    @abstractmethod
    def validate(
        self,
        image_input: Any,
        payload_bits: int,
        bits_per_channel: int = 1,
        header_reserved_bits: int = 256
    ) -> bool:
        """
        Validate image integrity, format compatibility, and payload capacity feasibility.

        :param image_input: Raw image bytes, PIL Image, or image metadata.
        :param payload_bits: Size of payload in bits to embed.
        :param bits_per_channel: Bit depth for embedding.
        :param header_reserved_bits: Reserved bits for steganography header.
        :return: True if valid and feasible.
        """
        pass

    @abstractmethod
    def get_capacity_statistics(
        self,
        image_input: Any,
        payload_bits: int = 0,
        bits_per_channel: int = 1,
        header_reserved_bits: int = 256
    ) -> LSBCapacityResult:
        """
        Retrieve comprehensive steganographic capacity analysis metrics.

        :param image_input: Raw image bytes, PIL Image, or metadata.
        :param payload_bits: Optional size of payload in bits.
        :param bits_per_channel: Bit depth per channel.
        :param header_reserved_bits: Reserved header bits.
        :return: Structured LSBCapacityResult model.
        """
        pass

    @abstractmethod
    def embed(
        self,
        cover_image_bytes: bytes,
        payload_data: Any,
        options: Optional[Dict[str, Any]] = None
    ) -> Tuple[bytes, Dict[str, Any]]:
        """
        Embed binary payload into cover image bytes.

        :param cover_image_bytes: Raw bytes of the cover image.
        :param payload_data: Payload object or binary string.
        :param options: Execution parameters (e.g., bits_per_channel, seed).
        :return: Tuple of (stego_image_bytes, execution_metrics).
        """
        pass

    @abstractmethod
    def extract(
        self,
        stego_image_bytes: bytes,
        options: Optional[Dict[str, Any]] = None
    ) -> Any:
        """
        Extract hidden payload from stego image bytes.

        :param stego_image_bytes: Raw bytes of stego image.
        :param options: Extraction options.
        :return: Extracted payload object or raw bitstream string.
        """
        pass
