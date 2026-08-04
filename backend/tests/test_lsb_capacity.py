"""
Unit tests for LSB Capacity Calculator (Phase 4A.2).
"""

import io
import pytest
from PIL import Image

from app.steganography.lsb.capacity import LSBCapacityCalculator
from app.steganography.factory import EmbeddingFactory
from app.steganography.lsb.service import LSBSteganography
from app.models.stego import LSBCapacityResult
from app.core.exceptions import (
    InvalidImageException,
    CorruptedImageException,
    UnsupportedFormatException,
    CapacityCalculationException,
    PayloadTooLargeException,
)


@pytest.fixture
def calculator():
    return LSBCapacityCalculator(default_bits_per_channel=1, default_header_reserved_bits=256)


@pytest.fixture
def rgb_png_bytes():
    """Create a 100x100 RGB PNG image in bytes."""
    img = Image.new("RGB", (100, 100), color=(255, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def rgba_png_bytes():
    """Create a 50x50 RGBA PNG image in bytes."""
    img = Image.new("RGBA", (50, 50), color=(0, 255, 0, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def grayscale_png_bytes():
    """Create a 200x200 Grayscale (L) PNG image in bytes."""
    img = Image.new("L", (200, 200), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def bmp_bytes():
    """Create a 100x100 RGB BMP image in bytes."""
    img = Image.new("RGB", (100, 100), color=(0, 0, 255))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()


@pytest.fixture
def jpeg_bytes():
    """Create a 100x100 JPEG image in bytes (Unsupported format)."""
    img = Image.new("RGB", (100, 100), color=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


# 1. Test RGB PNG Capacity Calculation
def test_calculate_capacity_rgb(calculator, rgb_png_bytes):
    # 100 x 100 pixels * 3 channels = 30,000 total bits
    # Reserved header: 256 bits -> usable: 29,744 bits
    usable_bits = calculator.calculate_capacity(rgb_png_bytes)
    assert usable_bits == 29744


# 2. Test RGBA PNG Capacity Calculation
def test_calculate_capacity_rgba(calculator, rgba_png_bytes):
    # 50 x 50 pixels * 4 channels = 10,000 total bits
    # Reserved header: 256 bits -> usable: 9,744 bits
    usable_bits = calculator.calculate_capacity(rgba_png_bytes)
    assert usable_bits == 9744


# 3. Test Grayscale PNG Capacity Calculation
def test_calculate_capacity_grayscale(calculator, grayscale_png_bytes):
    # 200 x 200 pixels * 1 channel = 40,000 total bits
    # Reserved header: 256 bits -> usable: 39,744 bits
    usable_bits = calculator.calculate_capacity(grayscale_png_bytes)
    assert usable_bits == 39744


# 4. Test BMP Image Capacity Calculation
def test_calculate_capacity_bmp(calculator, bmp_bytes):
    usable_bits = calculator.calculate_capacity(bmp_bytes)
    assert usable_bits == 29744


# 5. Test Metadata Dict Input
def test_calculate_capacity_metadata_dict(calculator):
    meta = {"width": 100, "height": 100, "channels": 3, "color_mode": "RGB"}
    usable_bits = calculator.calculate_capacity(meta)
    assert usable_bits == 29744


# 6. Test PIL Image Input directly
def test_calculate_capacity_pil_image(calculator):
    img = Image.new("RGB", (80, 80))
    # 80x80x3 = 19200 - 256 = 18944 bits
    usable_bits = calculator.calculate_capacity(img)
    assert usable_bits == 18944


# 7. Test Multi-Bit LSB Depth Overrides
def test_calculate_capacity_multi_bit(calculator, rgb_png_bytes):
    # 2 bits per channel -> 100x100x3x2 = 60,000 total bits - 256 = 59,744 bits
    usable_bits = calculator.calculate_capacity(rgb_png_bytes, bits_per_channel=2)
    assert usable_bits == 59744


# 8. Test Available Space Calculation
def test_calculate_available_space(calculator, rgb_png_bytes):
    # Usable: 29744. Embed payload of 1000 bits -> remaining: 28,744 bits
    remaining_bits = calculator.calculate_available_space(rgb_png_bytes, payload_bits=1000)
    assert remaining_bits == 28744


# 9. Test Feasibility Check (can_embed_payload)
def test_can_embed_payload(calculator, rgb_png_bytes):
    # Payload fits
    assert calculator.can_embed_payload(rgb_png_bytes, payload_bits=1000) is True
    # Payload exact size fits
    assert calculator.can_embed_payload(rgb_png_bytes, payload_bits=29744) is True
    # Payload oversized does not fit
    assert calculator.can_embed_payload(rgb_png_bytes, payload_bits=30000) is False
    # Zero or negative payload
    assert calculator.can_embed_payload(rgb_png_bytes, payload_bits=0) is False


# 10. Test Capacity Validation Exception Threshold
def test_validate_capacity_exception(calculator, rgb_png_bytes):
    # Valid payload does not raise
    assert calculator.validate_capacity(rgb_png_bytes, payload_bits=5000) is True

    # Oversized payload raises PayloadTooLargeException
    with pytest.raises(PayloadTooLargeException):
        calculator.validate_capacity(rgb_png_bytes, payload_bits=35000, raise_exception=True)


# 11. Test Full Detailed Statistics Model
def test_get_capacity_statistics(calculator, rgb_png_bytes):
    stats = calculator.get_capacity_statistics(rgb_png_bytes, payload_bits=2974)
    assert isinstance(stats, LSBCapacityResult)
    assert stats.image_width == 100
    assert stats.image_height == 100
    assert stats.channels == 3
    assert stats.total_pixels == 10000
    assert stats.color_mode == "RGB"
    assert stats.total_capacity_bits == 30000
    assert stats.total_capacity_bytes == 3750
    assert stats.header_reserved_bits == 256
    assert stats.usable_capacity_bits == 29744
    assert stats.usable_capacity_bytes == 3718
    assert stats.payload_size_bits == 2974
    assert stats.payload_size_bytes == 371
    assert stats.remaining_capacity_bits == 26770
    assert stats.remaining_capacity_bytes == 3346
    assert stats.utilization_percentage == 9.9987  # round((2974 / 29744) * 100, 4)
    assert stats.can_embed is True



# 12. Test Unsupported Format Rejection (JPEG)
def test_unsupported_format_jpeg(calculator, jpeg_bytes):
    with pytest.raises(UnsupportedFormatException):
        calculator.calculate_capacity(jpeg_bytes)


# 13. Test Palette Mode (P) Image Rejection
def test_palette_image_rejection(calculator):
    img = Image.new("P", (100, 100))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    with pytest.raises(UnsupportedFormatException):
        calculator.calculate_capacity(buf.getvalue())


# 14. Test Corrupt Bytes Handling
def test_corrupted_image_bytes(calculator):
    corrupt_bytes = b"PNG\x0d\x0a\x1a\x0a\x00\x00\x00\x0dIHDR_CORRUPTED_DATA_123"
    with pytest.raises((CorruptedImageException, InvalidImageException, UnsupportedFormatException)):
        calculator.calculate_capacity(corrupt_bytes)


# 15. Test Invalid Parameters (Negative Payload / Bit depth)
def test_invalid_parameters(calculator, rgb_png_bytes):
    with pytest.raises(CapacityCalculationException):
        calculator.calculate_capacity(rgb_png_bytes, bits_per_channel=0)

    with pytest.raises(CapacityCalculationException):
        calculator.calculate_available_space(rgb_png_bytes, payload_bits=-50)


# 16. Test Strategy & Factory Integration
def test_embedding_factory_lsb_capacity(rgb_png_bytes):
    strategy = EmbeddingFactory.get_strategy("LSB")
    assert isinstance(strategy, LSBSteganography)

    usable_bits = strategy.calculate_capacity(rgb_png_bytes)
    assert usable_bits == 29744

    assert strategy.validate(rgb_png_bytes, payload_bits=5000) is True
    stats = strategy.get_capacity_statistics(rgb_png_bytes, payload_bits=5000)
    assert stats.can_embed is True
    assert stats.payload_size_bits == 5000
