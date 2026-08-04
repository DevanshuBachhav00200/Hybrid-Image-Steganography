"""
Unit tests for LSB Validator, Pixel Iterator, and Bit Utilities (Phase 4A.5).
"""

import io
import pytest
from PIL import Image

from app.steganography.lsb.utils import LSBUtils
from app.steganography.lsb.iterator import PixelIterator
from app.steganography.lsb.validator import LSBValidator
from app.core.exceptions import ValidationException


@pytest.fixture
def sample_cover_png():
    img = Image.new("RGB", (50, 50), color=(100, 100, 100))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_stego_png(sample_cover_png):
    img = Image.open(io.BytesIO(sample_cover_png))
    # Modify 1 pixel slightly
    pixels = img.load()
    r, g, b = pixels[0, 0]
    pixels[0, 0] = (r + 1, g, b)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# 1. LSBUtils Bitwise Tests
def test_lsb_utils_bitwise():
    assert LSBUtils.set_lsb(254, 1) == 255
    assert LSBUtils.set_lsb(255, 0) == 254
    assert LSBUtils.get_lsb(255) == 1
    assert LSBUtils.get_lsb(254) == 0


# 2. LSBUtils Quality Metrics (PSNR & MSE)
def test_lsb_utils_metrics(sample_cover_png, sample_stego_png):
    mse = LSBUtils.calculate_mse(sample_cover_png, sample_stego_png)
    psnr = LSBUtils.calculate_psnr(sample_cover_png, sample_stego_png)

    assert mse > 0.0
    assert psnr > 40.0  # Slight modification maintains >40dB PSNR

    # Identical images have 0 MSE and infinite PSNR
    assert LSBUtils.calculate_mse(sample_cover_png, sample_cover_png) == 0.0
    assert LSBUtils.calculate_psnr(sample_cover_png, sample_cover_png) == float("inf")


# 3. PixelIterator Sequential Traversal
def test_pixel_iterator_sequential():
    iterator = PixelIterator()
    coords = list(iterator.generate_coordinates(width=2, height=2, channels=3, mode="sequential"))

    expected = [
        (0, 0, 0), (0, 0, 1), (0, 0, 2),
        (1, 0, 0), (1, 0, 1), (1, 0, 2),
        (0, 1, 0), (0, 1, 1), (0, 1, 2),
        (1, 1, 0), (1, 1, 1), (1, 1, 2)
    ]
    assert coords == expected


# 4. PixelIterator Randomized Traversal
def test_pixel_iterator_randomized():
    iterator = PixelIterator()
    coords1 = list(iterator.generate_coordinates(width=10, height=10, channels=3, mode="randomized", seed=42))
    coords2 = list(iterator.generate_coordinates(width=10, height=10, channels=3, mode="randomized", seed=42))
    coords3 = list(iterator.generate_coordinates(width=10, height=10, channels=3, mode="randomized", seed=99))

    assert len(coords1) == 300
    assert coords1 == coords2  # Same seed produces identical shuffle
    assert coords1 != coords3  # Different seed produces different shuffle


# 5. LSBValidator Postconditions Validation
def test_lsb_validator_postconditions(sample_cover_png, sample_stego_png):
    validator = LSBValidator()
    result = validator.validate_postconditions(sample_cover_png, sample_stego_png, min_psnr_db=40.0)

    assert result["valid"] is True
    assert result["dimensions_preserved"] is True
    assert result["psnr_db"] > 40.0


# 6. LSBValidator Postconditions Dimension Mismatch Rejection
def test_lsb_validator_dimension_mismatch(sample_cover_png):
    img_diff_size = Image.new("RGB", (100, 100))
    buf = io.BytesIO()
    img_diff_size.save(buf, format="PNG")
    diff_size_bytes = buf.getvalue()

    validator = LSBValidator()
    with pytest.raises(ValidationException):
        validator.validate_postconditions(sample_cover_png, diff_size_bytes)
