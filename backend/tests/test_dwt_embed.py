"""
Unit tests for DWT Embedding Engine (Phase 4C.3).
"""

import io
import pytest
from PIL import Image

from app.steganography.dwt.embed import DWTEmbedder
from app.steganography.factory import EmbeddingFactory
from app.steganography.dwt.service import DWTSteganography
from app.models.stego import DWTEmbeddingResult
from app.core.exceptions import PayloadTooLargeException, EmbeddingException


@pytest.fixture
def embedder():
    return DWTEmbedder()


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
def sample_bitstream():
    # 500-bit mock payload string
    return "01" * 250


# 1. Test DWT Embedding on RGB PNG
def test_embed_rgb_png(embedder, sample_cover_png, sample_bitstream):
    res = embedder.embed(sample_cover_png, sample_bitstream)

    assert isinstance(res, DWTEmbeddingResult)
    assert res.success is True
    assert len(res.stego_image_bytes) > 0
    assert res.payload_size_bits == 500
    assert res.wavelet_family == "haar"
    assert res.decomposition_level == 1
    assert "LH" in res.selected_subbands
    assert res.psnr_db >= 35.0
    assert res.dimensions == (128, 128)
    assert res.format == "PNG"


# 2. Test DWT Embedding on RGBA PNG
def test_embed_rgba_png(embedder, sample_rgba_png, sample_bitstream):
    res = embedder.embed(sample_rgba_png, sample_bitstream)

    assert res.success is True
    assert res.color_mode == "RGBA"
    assert res.psnr_db >= 35.0


# 3. Test DWT Embedding on Grayscale PNG
def test_embed_grayscale_png(embedder, sample_grayscale_png, sample_bitstream):
    res = embedder.embed(sample_grayscale_png, sample_bitstream, options={"selected_subbands": ["HL"]})

    assert res.success is True
    assert res.color_mode == "L"
    assert "HL" in res.selected_subbands


# 4. Test DWT Embedding on BMP Cover
def test_embed_bmp(embedder, sample_bmp_cover, sample_bitstream):
    res = embedder.embed(sample_bmp_cover, sample_bitstream)

    assert res.success is True
    assert res.format == "BMP"
    assert res.psnr_db >= 35.0


# 5. Test Payload Too Large handling
def test_embed_payload_too_large(embedder, sample_cover_png):
    # Total capacity for 128x128 RGB level 1 (LH, HL) is 24320 bits
    huge_bitstream = "1" * 30000

    with pytest.raises(PayloadTooLargeException):
        embedder.embed(sample_cover_png, huge_bitstream)


# 6. Test Invalid Payload format
def test_invalid_payload_format(embedder, sample_cover_png):
    # Payload contains non-binary letters
    with pytest.raises(EmbeddingException):
        embedder.embed(sample_cover_png, "0101abcd")

    # Empty payload
    with pytest.raises(EmbeddingException):
        embedder.embed(sample_cover_png, "")


# 7. Test Factory Dynamic strategy selection integration
def test_factory_dwt_embedding_integration(sample_cover_png, sample_bitstream):
    strategy = EmbeddingFactory.get_strategy("DWT")
    assert isinstance(strategy, DWTSteganography)

    stego_bytes, meta = strategy.embed(sample_cover_png, sample_bitstream)
    assert meta["success"] is True
    assert len(stego_bytes) > 0
    assert meta["payload_size_bits"] == 500
