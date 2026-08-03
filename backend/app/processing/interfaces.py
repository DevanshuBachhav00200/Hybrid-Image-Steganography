from abc import ABC, abstractmethod
from typing import Any, Dict


class EmbeddingStrategy(ABC):
    """
    Abstract Strategy Interface for Steganographic Embedding and Extraction algorithms (LSB, DCT, DWT).
    """
    @abstractmethod
    def embed(self, cover_image: bytes, binary_payload: str) -> bytes:
        """Embed binary payload into cover image bytes, returning stego image bytes."""
        pass

    @abstractmethod
    def extract(self, stego_image: bytes) -> str:
        """Extract hidden binary payload from stego image bytes."""
        pass


class SecurityStrategy(ABC):
    """
    Abstract Strategy Interface for Encryption and Decryption algorithms (AES-256).
    """
    @abstractmethod
    def encrypt(self, plain_text: str, password: str) -> str:
        """Encrypt plain text message using password."""
        pass

    @abstractmethod
    def decrypt(self, cipher_text: str, password: str) -> str:
        """Decrypt cipher text message using password."""
        pass


class MetricStrategy(ABC):
    """
    Abstract Strategy Interface for Image Quality Metric Calculators (PSNR, SSIM, MSE).
    """
    @abstractmethod
    def calculate(self, original_image: bytes, stego_image: bytes) -> Dict[str, Any]:
        """Calculate distortion and image quality metrics comparing original and stego images."""
        pass


class ImageProcessor(ABC):
    """
    Abstract Interface for Image pre/post processing operations.
    """
    @abstractmethod
    def process(self, image_bytes: bytes) -> bytes:
        """Process input image bytes and return modified bytes."""
        pass
