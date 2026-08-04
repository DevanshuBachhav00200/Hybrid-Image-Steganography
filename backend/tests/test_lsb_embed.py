"""
Unit tests for LSB Embedding Engine (Phase 4A.3).
"""

import io
import pytest
import numpy as np
from PIL import Image

from app.steganography.lsb.embed import LSBEmbedder
from app.steganography.lsb.capacity import LSBCapacityCalculator
from app.steganography.factory import EmbeddingFactory
from app.models.stego import LSBEmbeddingResult
from app.core.exceptions import (
    PayloadTooLargeException,
    UnsupportedFormatException,
    EmbeddingException,
    InvalidImageException,
)


@pytest.fixture
def embedder():
    return LSBEmbedder()


@pytest.fixture
def rgb_png_bytes():
    """Create a 100x100 RGB PNG image in bytes."""
    img = Image.new("RGB", (100, 100), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def rgba_png_bytes():
    """Create a 50x50 RGBA PNG image in bytes."""
    img = Image.new("RGBA", (50, 50), color=(50, 100, 150, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def grayscale_png_bytes():
    """Create a 100x100 Grayscale (L) PNG image in bytes."""
    img = Image.new("L", (100, 100), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def bmp_bytes():
    """Create a 100x100 RGB BMP image in bytes."""
    img = Image.new("RGB", (100, 100), color=(120, 130, 140))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()


@pytest.fixture
def sample_payload():
    """Create a 256-bit alternating binary bitstream."""
    return "10101100" * 32  # 256 bits


# 1. Test RGB PNG Embedding & Bit Verification
def test_embed_rgb_png(embedder, rgb_png_bytes, sample_payload):
    result = embedder.embed(rgb_png_bytes, sample_payload)
    assert isinstance(result, LSBEmbeddingResult)
    assert result.success is True
    assert result.image_width == 100
    assert result.image_height == 100
    assert result.channels == 3
    assert result.color_mode == "RGB"
    assert result.format == "PNG"
    assert result.payload_size_bits == 256

    # Verify extracted LSB bits directly from stego image array
    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    stego_np = np.array(stego_img, dtype=np.uint8).ravel()

    extracted_bits = "".join(str(stego_np[i] & 1) for i in range(len(sample_payload)))
    assert extracted_bits == sample_payload


# 2. Test RGBA PNG Embedding & Bit Verification
def test_embed_rgba_png(embedder, rgba_png_bytes, sample_payload):
    result = embedder.embed(rgba_png_bytes, sample_payload)
    assert result.success is True
    assert result.channels == 4

    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    stego_np = np.array(stego_img, dtype=np.uint8).ravel()

    extracted_bits = "".join(str(stego_np[i] & 1) for i in range(len(sample_payload)))
    assert extracted_bits == sample_payload


# 3. Test Grayscale PNG Embedding & Bit Verification
def test_embed_grayscale_png(embedder, grayscale_png_bytes, sample_payload):
    result = embedder.embed(grayscale_png_bytes, sample_payload)
    assert result.success is True
    assert result.channels == 1

    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    stego_np = np.array(stego_img, dtype=np.uint8).ravel()

    extracted_bits = "".join(str(stego_np[i] & 1) for i in range(len(sample_payload)))
    assert extracted_bits == sample_payload


# 4. Test BMP Image Embedding
def test_embed_bmp(embedder, bmp_bytes, sample_payload):
    result = embedder.embed(bmp_bytes, sample_payload)
    assert result.success is True
    assert result.format == "BMP"

    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    stego_np = np.array(stego_img, dtype=np.uint8).ravel()

    extracted_bits = "".join(str(stego_np[i] & 1) for i in range(len(sample_payload)))
    assert extracted_bits == sample_payload


# 5. Test Image Visual Quality & Pixel Delta Bounds (|S - P| <= 1)
def test_pixel_delta_bounds(embedder, rgb_png_bytes, sample_payload):
    orig_img = Image.open(io.BytesIO(rgb_png_bytes))
    orig_np = np.array(orig_img, dtype=np.int16).ravel()

    result = embedder.embed(rgb_png_bytes, sample_payload)
    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    stego_np = np.array(stego_img, dtype=np.int16).ravel()

    # Maximum pixel value change must be at most 1
    diff = np.abs(orig_np - stego_np)
    assert np.max(diff) <= 1
    # Pixels beyond payload size must remain untouched
    assert np.max(diff[len(sample_payload):]) == 0


# 6. Test Dictionary & Payload Object Input Formats
def test_embed_payload_object_formats(embedder, rgb_png_bytes, sample_payload):
    # Dict format
    payload_dict = {"binary_payload": sample_payload}
    res_dict = embedder.embed(rgb_png_bytes, payload_dict)
    assert res_dict.success is True

    # Custom Class with binary_payload attribute
    class DummyPayload:
        def __init__(self, bitstream):
            self.binary_payload = bitstream

    res_obj = embedder.embed(rgb_png_bytes, DummyPayload(sample_payload))
    assert res_obj.success is True


# 7. Test Payload Too Large Exception Rejection
def test_embed_payload_too_large(embedder, rgb_png_bytes):
    # Cover capacity is 29,744 bits. Create an oversized payload of 35,000 bits.
    oversized_payload = "1" * 35000
    with pytest.raises(PayloadTooLargeException):
        embedder.embed(rgb_png_bytes, oversized_payload)


# 8. Test Invalid Payload Bitstream Handling
def test_invalid_payload_bitstream(embedder, rgb_png_bytes):
    # Empty bitstream
    with pytest.raises(EmbeddingException):
        embedder.embed(rgb_png_bytes, "")

    # Non-binary characters
    with pytest.raises(EmbeddingException):
        embedder.embed(rgb_png_bytes, "010101201")


# 9. Test Unsupported Format Rejection (JPEG)
def test_embed_unsupported_format(embedder, sample_payload):
    img = Image.new("RGB", (100, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    jpeg_bytes = buf.getvalue()

    with pytest.raises(UnsupportedFormatException):
        embedder.embed(jpeg_bytes, sample_payload)


# 10. Test Integration with EmbeddingFactory & Strategy Interface
def test_factory_lsb_embedding_integration(rgb_png_bytes, sample_payload):
    strategy = EmbeddingFactory.get_strategy("LSB")
    stego_bytes, metrics = strategy.embed(rgb_png_bytes, sample_payload)

    assert isinstance(stego_bytes, bytes)
    assert isinstance(metrics, dict)
    assert metrics["success"] is True
    assert metrics["payload_size_bits"] == len(sample_payload)

    # Verify LSB bits of output stego bytes
    stego_img = Image.open(io.BytesIO(stego_bytes))
    stego_np = np.array(stego_img, dtype=np.uint8).ravel()

    extracted_bits = "".join(str(stego_np[i] & 1) for i in range(len(sample_payload)))
    assert extracted_bits == sample_payload
