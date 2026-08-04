"""
Steganography domain package for Hybrid Image Steganography System.
Contains algorithm strategy implementations, embedding factory, and spatial/frequency domain components.
"""

from app.steganography.base import EmbeddingStrategy
from app.steganography.factory import EmbeddingFactory
from app.steganography.lsb.service import LSBSteganography

# Automatically register LSB Strategy in factory
EmbeddingFactory.register("LSB", LSBSteganography)

__all__ = ["EmbeddingStrategy", "EmbeddingFactory", "LSBSteganography"]

