import io
from typing import Tuple, Dict, Any, Optional
from PIL import Image
from app.core.exceptions import InvalidImageException, CorruptedImageException
from app.core.logging import logger


class ImageLoader:
    """
    Processing layer loader responsible for safely reading uploaded image bytes,
    verifying structural data, and preparing numpy-compatible pixel representations.
    """

    def load_image(self, file_bytes: bytes) -> Image.Image:
        """
        Safely open image bytes using Pillow.
        Raises CorruptedImageException if image bytes cannot be parsed.
        """
        logger.info(f"ImageLoader: Loading image bytes ({len(file_bytes)} bytes)")
        if not file_bytes:
            raise InvalidImageException("Cannot load empty image byte buffer.")
        try:
            img = Image.open(io.BytesIO(file_bytes))
            img.load()
            return img
        except Exception as exc:
            logger.error(f"ImageLoader: Failed to load image: {str(exc)}")
            raise CorruptedImageException(f"Failed to load image pixel data: {str(exc)}")

    def get_numpy_array_placeholder(self, img: Image.Image) -> Dict[str, Any]:
        """
        Returns placeholder metadata dictionary representing a NumPy array structure
        for future steganography embedding modules (Phase 3D / 3E).
        """
        logger.info(f"ImageLoader: Extracted NumPy placeholder for image size {img.size}")
        return {
            "shape": (img.height, img.width, len(img.getbands())),
            "mode": img.mode,
            "dtype": "uint8",
        }
