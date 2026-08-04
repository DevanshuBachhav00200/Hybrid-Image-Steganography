"""
Steganography domain package for Hybrid Image Steganography System.
Contains algorithm strategy implementations, embedding factory, and spatial/frequency domain components.
"""

from app.steganography.base import EmbeddingStrategy
from app.steganography.factory import EmbeddingFactory
from app.steganography.lsb.service import LSBSteganography
from app.steganography.dct.service import DCTSteganography
from app.steganography.dwt.service import DWTSteganography

# Automatically register LSB, DCT & DWT Strategies in factory
EmbeddingFactory.register("LSB", LSBSteganography)
EmbeddingFactory.register("DCT", DCTSteganography)
EmbeddingFactory.register("DWT", DWTSteganography)

__all__ = ["EmbeddingStrategy", "EmbeddingFactory", "LSBSteganography", "DCTSteganography", "DWTSteganography"]



