from abc import ABC, abstractmethod
from typing import Set


class MorseInterface(ABC):
    """
    Abstract Interface for International Morse Code Encoder and Decoder.
    """

    @abstractmethod
    def encode(self, text: str) -> str:
        """Encode plain text string to Morse code sequence."""
        pass

    @abstractmethod
    def decode(self, morse: str) -> str:
        """Decode Morse code sequence back to plain text string."""
        pass

    @abstractmethod
    def validate(self, text: str) -> bool:
        """Validate if plain text string contains supported characters only."""
        pass

    @abstractmethod
    def supported_characters(self) -> Set[str]:
        """Return set of all supported characters."""
        pass
