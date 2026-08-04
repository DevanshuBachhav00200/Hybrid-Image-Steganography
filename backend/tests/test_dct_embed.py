"""
Unit tests for DCT Embedding Engine (Phase 4B.3).
"""

import io
import pytest
from PIL import Image

from app.steganography.dct.embed import DCTEmbedder
from app.steganography.factory import EmbeddingFactory
from app.steganography.dct.service import DCTSteganography
from app.models.stego import DCTEmbeddingResult
from app.core.exceptions import (
    EmbeddingException,
    PayloadTooLargeException,
    UnsupportedFormatException,
)


@pytest.fixture
def embedder():
    return DCTEmbedder()


@pytest.fixture
def sample_cover_png():
    """Create a 128x128 RGB PNG cover image."""
    img = Image.new("RGB", (128, 128), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_rgba_png():
    """Create a 128x128 RGBA PNG cover image."""
    img = Image.new("RGBA", (128, 128), color=(100, 150, 200, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_grayscale_png():
    """Create a 128x128 Grayscale PNG cover image."""
    img = Image.new("L", (128, 128), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_bmp_cover():
    """Create a 128x128 RGB BMP cover image."""
    img = Image.new("RGB", (128, 128), color=(80, 120, 160))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()



@pytest.fixture
def sample_payload_bitstream():
    """Generate a sample 128-bit binary bitstream string."""
    return "10101100" * 16  # 128 bits


# 1. DCT Embedding into RGB PNG Image
def test_embed_rgb_png(embedder, sample_cover_png, sample_payload_bitstream):
    result = embedder.embed(sample_cover_png, sample_payload_bitstream)

    assert isinstance(result, DCTEmbeddingResult)
    assert result.success is True
    assert len(result.stego_image_bytes) > 0
    assert result.payload_size_bits == 128
    assert result.coefficients_modified > 0
    assert result.psnr_db >= 38.0  # DCT mid-frequency parity quantization maintains excellent PSNR
    assert result.format == "PNG"
    assert result.dimensions == (128, 128)

    # Verify stego image format and dimensions remain identical
    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    assert stego_img.size == (128, 128)
    assert stego_img.mode == "RGB"


# 2. DCT Embedding into RGBA PNG Image
def test_embed_rgba_png(embedder, sample_rgba_png, sample_payload_bitstream):
    result = embedder.embed(sample_rgba_png, sample_payload_bitstream)

    assert result.success is True
    assert result.color_mode == "RGBA"
    assert result.dimensions == (128, 128)


# 3. DCT Embedding into Grayscale PNG Image
def test_embed_grayscale_png(embedder, sample_grayscale_png, sample_payload_bitstream):
    result = embedder.embed(sample_grayscale_png, sample_payload_bitstream, options={"coefficients_per_block": 4})

    assert result.success is True
    assert result.color_mode == "L"
    assert result.dimensions == (128, 128)



# 4. DCT Embedding into BMP Cover Image
def test_embed_bmp(embedder, sample_bmp_cover, sample_payload_bitstream):
    result = embedder.embed(sample_bmp_cover, sample_payload_bitstream)

    assert result.success is True
    assert result.format == "BMP"

    stego_img = Image.open(io.BytesIO(result.stego_image_bytes))
    assert stego_img.format == "BMP"


# 5. Rejection of Payload Exceeding DCT Capacity
def test_embed_payload_too_large(embedder, sample_grayscale_png):
    # 64x64 L = 64 blocks * 1 ch = 64 blocks. Total = 64 bits. Reserved = 256 -> Usable = 0 bits.
    with pytest.raises(PayloadTooLargeException):
        embedder.embed(sample_grayscale_png, "1" * 500, options={"coefficients_per_block": 1, "header_reserved_bits": 256})


# 6. Rejection of Invalid Bitstream Format (Non 0/1 Characters)
def test_invalid_payload_format(embedder, sample_cover_png):
    with pytest.raises(EmbeddingException):
        embedder.embed(sample_cover_png, "1010120011")


# 7. Integration with EmbeddingFactory strategy execution
def test_factory_dct_embedding_integration(sample_cover_png, sample_payload_bitstream):
    strategy = EmbeddingFactory.get_strategy("DCT")
    assert isinstance(strategy, DCTSteganography)

    stego_bytes, meta = strategy.embed(sample_cover_png, sample_payload_bitstream)

    assert len(stego_bytes) > 0
    assert meta["success"] is True
    assert meta["payload_size_bits"] == 128
    assert meta["psnr_db"] >= 38.0
