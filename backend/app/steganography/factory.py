"""
Factory module for instantiating concrete Steganography Embedding Strategies.
"""

from typing import Dict, Type
from app.core.enums import AlgorithmType
from app.core.exceptions import UnsupportedFormatException
from app.steganography.base import EmbeddingStrategy


class EmbeddingFactory:
    """
    Factory pattern provider for selecting and instantiating steganography algorithm strategies (LSB, DCT, DWT).
    """

    _registry: Dict[str, Type[EmbeddingStrategy]] = {}

    @classmethod
    def register(cls, algorithm: str, strategy_cls: Type[EmbeddingStrategy]) -> None:
        """
        Register a concrete strategy class for an algorithm name.
        """
        cls._registry[algorithm.upper()] = strategy_cls

    @classmethod
    def get_strategy(cls, algorithm: str) -> EmbeddingStrategy:
        """
        Instantiate and return the strategy registered for specified algorithm name.
        """
        alg_name = algorithm.upper()
        if alg_name not in cls._registry:
            raise UnsupportedFormatException(
                f"Steganography algorithm '{algorithm}' is not registered or supported."
            )
        return cls._registry[alg_name]()
