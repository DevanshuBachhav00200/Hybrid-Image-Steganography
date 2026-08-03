from abc import ABC, abstractmethod
from typing import Dict, Any


class BinaryInterface(ABC):
    """
    Abstract Interface for Binary Bitstream Conversion and Parsing.
    """

    @abstractmethod
    def serialize(self, aes_payload: Dict[str, Any]) -> str:
        """Convert AES payload object into MSB-first binary bitstream string."""
        pass

    @abstractmethod
    def deserialize(self, bitstream: str) -> Dict[str, Any]:
        """Convert MSB-first binary bitstream string back into AES payload object."""
        pass
