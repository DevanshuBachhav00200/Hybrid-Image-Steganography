"""
LSB Validator Sub-module.
Provides pre-condition and post-condition steganographic image integrity checks.
"""

import io
from typing import Dict, Any, Optional
from PIL import Image

from app.steganography.lsb.capacity import LSBCapacityCalculator
from app.steganography.lsb.utils import LSBUtils
from app.core.exceptions import ValidationException, CorruptedImageException


class LSBValidator:
    """
    LSB Validator component for verifying capacity, image dimensions, format preservation,
    and post-embedding steganographic distortion limits.
    """

    def __init__(self, capacity_calculator: Optional[LSBCapacityCalculator] = None):
        self.capacity_calculator = capacity_calculator or LSBCapacityCalculator()

    def validate_preconditions(
        self, cover_image_bytes: bytes, payload_bits: int, options: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Validate cover image format, integrity, and embedding capacity limits.
        """
        return self.capacity_calculator.validate_capacity(cover_image_bytes, payload_bits, raise_exception=True)

    def validate_postconditions(
        self,
        original_image_bytes: bytes,
        stego_image_bytes: bytes,
        min_psnr_db: float = 40.0
    ) -> Dict[str, Any]:
        """
        Validate post-embedding steganographic integrity, format preservation, and PSNR distortion threshold.

        :param original_image_bytes: Original cover image bytes.
        :param stego_image_bytes: Embedded stego image bytes.
        :param min_psnr_db: Minimum acceptable Peak Signal-to-Noise Ratio in dB.
        :return: Validation summary metrics dictionary.
        """
        try:
            img_orig = Image.open(io.BytesIO(original_image_bytes))
            img_stego = Image.open(io.BytesIO(stego_image_bytes))
        except Exception as exc:
            raise CorruptedImageException(f"Failed to load images for post-embedding validation: {str(exc)}")

        if img_orig.size != img_stego.size:
            raise ValidationException(f"Dimension mismatch: Original {img_orig.size} vs Stego {img_stego.size}")

        if img_orig.mode != img_stego.mode:
            raise ValidationException(f"Color mode mismatch: Original {img_orig.mode} vs Stego {img_stego.mode}")

        fmt_orig = (img_orig.format or "PNG").upper()
        fmt_stego = (img_stego.format or "PNG").upper()
        if fmt_orig != fmt_stego:
            raise ValidationException(f"Format mismatch: Original {fmt_orig} vs Stego {fmt_stego}")

        mse = LSBUtils.calculate_mse(original_image_bytes, stego_image_bytes)
        psnr = LSBUtils.calculate_psnr(original_image_bytes, stego_image_bytes)

        if psnr < min_psnr_db:
            raise ValidationException(
                f"Stego image PSNR ({psnr} dB) fell below quality threshold ({min_psnr_db} dB)."
            )

        return {
            "valid": True,
            "mse": mse,
            "psnr_db": psnr,
            "dimensions_preserved": True,
            "color_mode_preserved": True,
            "format_preserved": True,
        }
