from abc import ABC, abstractmethod
from typing import Dict, Any


class AESInterface(ABC):
    """
    Abstract Interface for AES-256-GCM Cryptographic Operations.
    """

    @abstractmethod
    def derive_key(self, password: str, salt: bytes) -> bytes:
        """Derive 256-bit symmetric encryption key from password and salt."""
        pass

    @abstractmethod
    def encrypt(self, data: str, password: str) -> Dict[str, Any]:
        """Encrypt plain text data using AES-256-GCM and password key."""
        pass

    @abstractmethod
    def decrypt(self, payload: Dict[str, Any], password: str) -> str:
        """Decrypt AES-256-GCM payload using password key."""
        pass
