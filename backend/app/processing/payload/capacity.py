from typing import Dict, Optional
from app.schemas.upload import ImageMetadata


class CapacityEstimator:
    """
    Capacity Estimator component providing placeholder steganographic embedding capacity
    evaluations for LSB, DCT, and DWT domain algorithms based on cover image dimensions.
    """

    @staticmethod
    def estimate_lsb(image_metadata: Optional[ImageMetadata]) -> int:
        """
        Estimate theoretical LSB capacity in bits (1 bit per RGB channel per pixel).
        """
        if not image_metadata:
            return 1024 * 1024 * 8  # Default 1MB capacity placeholder
        total_pixels = image_metadata.width * image_metadata.height
        channels = image_metadata.channels if image_metadata.channels else 3
        return total_pixels * channels  # 1 bit per channel

    @staticmethod
    def estimate_dct(image_metadata: Optional[ImageMetadata]) -> int:
        """
        Estimate theoretical DCT capacity in bits (~1 bit per 8x8 block).
        """
        if not image_metadata:
            return 256 * 1024 * 8  # Default 256KB capacity placeholder
        blocks = (image_metadata.width // 8) * (image_metadata.height // 8)
        return blocks * 4  # 4 bits per 8x8 block

    @staticmethod
    def estimate_dwt(image_metadata: Optional[ImageMetadata]) -> int:
        """
        Estimate theoretical DWT capacity in bits (~1 bit per LL subband coefficient block).
        """
        if not image_metadata:
            return 512 * 1024 * 8  # Default 512KB capacity placeholder
        blocks = (image_metadata.width // 4) * (image_metadata.height // 4)
        return blocks * 2  # 2 bits per DWT coefficient block

    @classmethod
    def estimate_best(cls, image_metadata: Optional[ImageMetadata]) -> Dict[str, int]:
        """Return dictionary of estimated capacities across all algorithms."""
        return {
            "LSB": cls.estimate_lsb(image_metadata),
            "DCT": cls.estimate_dct(image_metadata),
            "DWT": cls.estimate_dwt(image_metadata),
        }
