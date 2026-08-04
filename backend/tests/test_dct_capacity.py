"""
Unit tests for DCT Capacity Calculator (Phase 4B.2).
"""

import io
import pytest
from PIL import Image

from app.steganography.dct.capacity import DCTCapacityCalculator
from app.steganography.factory import EmbeddingFactory
from app.steganography.dct.service import DCTSteganography
from app.models.stego import DCTCapacityResult
from app.core.exceptions import (
    PayloadTooLargeException,
    UnsupportedFormatException,
    InvalidImageException,
    CorruptedImageException,
    CapacityCalculationException,
)


@pytest.fixture
def calculator():
    return DCTCapacityCalculator()


@pytest.fixture
def sample_rgb_png():
    """Create a 128x128 RGB PNG image."""
    img = Image.new("RGB", (128, 128), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_rgba_png():
    """Create a 64x64 RGBA PNG image."""
    img = Image.new("RGBA", (64, 64), color=(100, 150, 200, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_grayscale_png():
    """Create a 64x64 Grayscale 'L' PNG image."""
    img = Image.new("L", (64, 64), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# 1. Capacity Calculation for RGB PNG (128x128)
def test_calculate_capacity_rgb(calculator, sample_rgb_png):
    # 128x128 RGB = (16 * 16) blocks per channel = 256 blocks * 3 ch = 768 blocks
    # Total Capacity = 768 * 1 = 768 bits. Reserved = 256. Usable = 512 bits.
    usable_bits = calculator.calculate_capacity(sample_rgb_png, coefficients_per_block=1, header_reserved_bits=256)
    assert usable_bits == 512


# 2. Capacity Calculation for RGBA PNG (64x64)
def test_calculate_capacity_rgba(calculator, sample_rgba_png):
    # 64x64 RGBA = (8 * 8) blocks * 4 ch = 256 blocks. Total = 256 bits. Reserved = 256. Usable = 0 bits.
    usable_bits = calculator.calculate_capacity(sample_rgba_png, coefficients_per_block=1, header_reserved_bits=256)
    assert usable_bits == 0


# 3. Capacity Calculation for Grayscale PNG (64x64)
def test_calculate_capacity_grayscale(calculator, sample_grayscale_png):
    # 64x64 L = 64 blocks * 1 ch = 64 blocks.
    # With 8 coefficients per block = 512 bits. Reserved = 256 -> Usable = 256 bits.
    usable_bits = calculator.calculate_capacity(sample_grayscale_png, coefficients_per_block=8, header_reserved_bits=256)
    assert usable_bits == 256


# 4. Multi-Coefficient Capacity Scaling
def test_calculate_capacity_multi_coefficient(calculator, sample_rgb_png):
    # 768 blocks * 4 coeffs/block = 3072 bits. Reserved = 256 -> Usable = 2816 bits.
    usable_bits = calculator.calculate_capacity(sample_rgb_png, coefficients_per_block=4, header_reserved_bits=256)
    assert usable_bits == 2816


# 5. Available Space & Embeddability Validation
def test_calculate_available_space(calculator, sample_rgb_png):
    usable_bits = calculator.calculate_capacity(sample_rgb_png, coefficients_per_block=1, header_reserved_bits=256)
    available_bits = calculator.calculate_available_space(sample_rgb_png, payload_bits=200, coefficients_per_block=1, header_reserved_bits=256)

    assert available_bits == usable_bits - 200
    assert calculator.can_embed_payload(sample_rgb_png, payload_bits=500) is True
    assert calculator.can_embed_payload(sample_rgb_png, payload_bits=600) is False


# 6. Payload Validation Exception Handling
def test_validate_capacity_exception(calculator, sample_rgb_png):
    assert calculator.validate_capacity(sample_rgb_png, payload_bits=300) is True

    with pytest.raises(PayloadTooLargeException):
        calculator.validate_capacity(sample_rgb_png, payload_bits=99999)


# 7. Statistics Model Generation
def test_get_capacity_statistics(calculator, sample_rgb_png):
    stats = calculator.get_capacity_statistics(sample_rgb_png, payload_bits=256, coefficients_per_block=1, header_reserved_bits=256)

    assert isinstance(stats, DCTCapacityResult)
    assert stats.image_width == 128
    assert stats.image_height == 128
    assert stats.total_8x8_blocks == 768
    assert stats.usable_capacity_bits == 512
    assert stats.payload_size_bits == 256
    assert stats.remaining_capacity_bits == 256
    assert stats.utilization_percentage == 50.0
    assert stats.can_embed is True


# 8. Rejection of Images Smaller Than 8x8 Pixels
def test_too_small_image_rejection(calculator):
    img_tiny = Image.new("RGB", (4, 4))
    buf = io.BytesIO()
    img_tiny.save(buf, format="PNG")

    with pytest.raises(InvalidImageException):
        calculator.calculate_capacity(buf.getvalue())


# 9. Unsupported Format Rejection (JPEG)
def test_unsupported_jpeg_rejection(calculator):
    img_jpeg = Image.new("RGB", (32, 32))
    buf = io.BytesIO()
    img_jpeg.save(buf, format="JPEG")

    with pytest.raises(UnsupportedFormatException):
        calculator.calculate_capacity(buf.getvalue())


# 10. Factory Registration & Strategy Integration
def test_factory_dct_capacity_integration(sample_rgb_png):
    strategy = EmbeddingFactory.get_strategy("DCT")
    assert isinstance(strategy, DCTSteganography)

    usable_bits = strategy.calculate_capacity(sample_rgb_png, bits_per_channel=1, header_reserved_bits=256)
    assert usable_bits == 512

    stats = strategy.get_capacity_statistics(sample_rgb_png, payload_bits=128, bits_per_channel=1, header_reserved_bits=256)
    assert isinstance(stats, DCTCapacityResult)
    assert stats.usable_capacity_bits == 512
