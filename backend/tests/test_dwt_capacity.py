"""
Unit tests for DWT Capacity Calculator (Phase 4C.2).
"""

import io
import pytest
from PIL import Image

from app.steganography.dwt.capacity import DWTCapacityCalculator
from app.steganography.factory import EmbeddingFactory
from app.steganography.dwt.service import DWTSteganography
from app.core.exceptions import CapacityCalculationException, PayloadTooLargeException


@pytest.fixture
def calculator():
    return DWTCapacityCalculator()


@pytest.fixture
def sample_img_rgb():
    """Create a 128x128 RGB PNG image."""
    img = Image.new("RGB", (128, 128), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_img_grayscale():
    """Create a 128x128 Grayscale PNG image."""
    img = Image.new("L", (128, 128), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# 1. Test DWT capacity calculator formulas for RGB
def test_dwt_capacity_rgb(calculator, sample_img_rgb):
    # RGB image (128x128, level 1, selected subbands LH, HL -> 2 subbands, 3 channels)
    # Subband shape: 128 // 2 = 64x64. Size = 4096 coefficients.
    # Total coefficients = 4096 * 2 subbands * 3 channels = 24576 coefficients.
    # Usable capacity = 24576 - 256 (reserved bits) = 24320 bits.
    capacity = calculator.calculate_capacity(
        sample_img_rgb,
        options={"decomposition_level": 1, "selected_subbands": ["LH", "HL"]}
    )
    assert capacity == 24320


# 2. Test DWT capacity calculator formulas for Grayscale
def test_dwt_capacity_grayscale(calculator, sample_img_grayscale):
    # Grayscale image (128x128, level 2, selected subbands LH, HL, HH -> 3 subbands, 1 channel)
    # Subband shape: 128 // 4 = 32x32. Size = 1024 coefficients.
    # Total coefficients = 1024 * 3 subbands * 1 channel = 3072 coefficients.
    # Usable capacity = 3072 - 256 = 2816 bits.
    capacity = calculator.calculate_capacity(
        sample_img_grayscale,
        options={"decomposition_level": 2, "selected_subbands": ["LH", "HL", "HH"]}
    )
    assert capacity == 2816


# 3. Test validation capacity checks
def test_validate_capacity(calculator, sample_img_rgb):
    # Valid payload size (e.g. 500 bits < 24320 bits capacity)
    assert calculator.validate_capacity(sample_img_rgb, payload_bits=500) is True

    # Exceeding payload size raises exception
    with pytest.raises(PayloadTooLargeException):
        calculator.validate_capacity(sample_img_rgb, payload_bits=30000)


# 4. Test capacity statistics return model
def test_get_capacity_statistics(calculator, sample_img_rgb):
    stats = calculator.get_capacity_statistics(sample_img_rgb, payload_bits=1000)

    assert stats.success is True
    assert stats.total_coefficients == 24576
    assert stats.usable_capacity_bits == 24320
    assert stats.remaining_capacity_bits == 23320
    assert stats.capacity_used_percentage > 0.0
    assert stats.dimensions == (128, 128)
    assert stats.color_mode == "RGB"
    assert stats.wavelet_family == "haar"


# 5. Test factory dynamic registry lookup
def test_factory_dwt_capacity_lookup(sample_img_rgb):
    strategy = EmbeddingFactory.get_strategy("DWT")
    assert isinstance(strategy, DWTSteganography)

    capacity = strategy.calculate_capacity(sample_img_rgb)
    assert capacity == 24320

    stats = strategy.get_capacity_statistics(sample_img_rgb, payload_bits=500)
    assert stats.usable_capacity_bits == 24320
