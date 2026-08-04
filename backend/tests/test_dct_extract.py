"""
Unit tests for DCT Extraction Engine (Phase 4B.4).
"""

import io
import pytest
from PIL import Image

from app.steganography.dct.embed import DCTEmbedder
from app.steganography.dct.extract import DCTExtractor
from app.steganography.factory import EmbeddingFactory
from app.steganography.dct.service import DCTSteganography
from app.processing.binary.service import BinaryService
from app.models.stego import DCTExtractionResult
from app.core.exceptions import (
    NoHiddenDataException,
    CorruptedHeaderException,
    UnsupportedFormatException,
    InvalidImageException,
)


@pytest.fixture
def embedder():
    return DCTEmbedder()


@pytest.fixture
def extractor():
    return DCTExtractor()


@pytest.fixture
def binary_service():
    return BinaryService()


@pytest.fixture
def sample_cover_png():
    """Create a 200x200 RGB PNG cover image."""
    img = Image.new("RGB", (200, 200), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_rgba_png():
    """Create a 200x200 RGBA PNG cover image."""
    img = Image.new("RGBA", (200, 200), color=(100, 150, 200, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_grayscale_png():
    """Create a 200x200 Grayscale PNG cover image."""
    img = Image.new("L", (200, 200), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_bmp_cover():
    """Create a 200x200 RGB BMP cover image."""
    img = Image.new("RGB", (200, 200), color=(80, 120, 160))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()



@pytest.fixture
def sample_aes_payload():
    return {
        "ciphertext": "Q2lwaGVydGV4dERhdGExMjM0NTY=",
        "salt": "U2FsdEJ5dGVzMTZfQnl0ZQ==",
        "nonce": "Tm9uY2VCeXRlczEy",
        "authentication_tag": "QXV0aFRhZ0J5dGVzMTZfXw==",
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }


@pytest.fixture
def sample_aes_payload_bitstream(binary_service, sample_aes_payload):
    return binary_service.serialize(sample_aes_payload)


# 1. Full DCT Embed & Extract Roundtrip (RGB PNG)
def test_extract_rgb_png(embedder, extractor, sample_cover_png, sample_aes_payload_bitstream):
    embed_result = embedder.embed(sample_cover_png, sample_aes_payload_bitstream)
    stego_bytes = embed_result.stego_image_bytes

    extract_result = extractor.extract(stego_bytes)

    assert isinstance(extract_result, DCTExtractionResult)
    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream
    assert extract_result.payload_size_bits == len(sample_aes_payload_bitstream)
    assert extract_result.header_info["magic_number"] in ["STEGO", b"STEGO"]


# 2. Full DCT Embed & Extract Roundtrip (RGBA PNG)
def test_extract_rgba_png(embedder, extractor, sample_rgba_png, sample_aes_payload_bitstream):
    embed_result = embedder.embed(sample_rgba_png, sample_aes_payload_bitstream)
    stego_bytes = embed_result.stego_image_bytes

    extract_result = extractor.extract(stego_bytes)

    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream


# 3. Full DCT Embed & Extract Roundtrip (Grayscale PNG)
def test_extract_grayscale_png(embedder, extractor, sample_grayscale_png, sample_aes_payload_bitstream):
    embed_result = embedder.embed(sample_grayscale_png, sample_aes_payload_bitstream, options={"coefficients_per_block": 4})
    stego_bytes = embed_result.stego_image_bytes

    extract_result = extractor.extract(stego_bytes, options={"coefficients_per_block": 4})

    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream


# 4. Full DCT Embed & Extract Roundtrip (BMP)
def test_extract_bmp(embedder, extractor, sample_bmp_cover, sample_aes_payload_bitstream):
    embed_result = embedder.embed(sample_bmp_cover, sample_aes_payload_bitstream)
    stego_bytes = embed_result.stego_image_bytes

    extract_result = extractor.extract(stego_bytes)

    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream


# 5. Integration Test: DCT Extraction + Binary Parser Serialization
def test_extract_and_binary_parse_integration(embedder, extractor, binary_service, sample_cover_png, sample_aes_payload_bitstream, sample_aes_payload):
    embed_result = embedder.embed(sample_cover_png, sample_aes_payload_bitstream)

    extract_result = extractor.extract(embed_result.stego_image_bytes)
    recovered_bitstream = extract_result.recovered_payload

    # Pass recovered DCT payload to Phase 3 Binary Parser
    deserialized_payload = binary_service.deserialize(recovered_bitstream)

    assert deserialized_payload["ciphertext"] == sample_aes_payload["ciphertext"]
    assert deserialized_payload["salt"] == sample_aes_payload["salt"]
    assert deserialized_payload["nonce"] == sample_aes_payload["nonce"]


# 6. Rejection of Clean Image with No Hidden Data
def test_extract_no_hidden_data(extractor, sample_cover_png):
    with pytest.raises(NoHiddenDataException):
        extractor.extract(sample_cover_png)


# 7. Factory Integration: Strategy Extract Method
def test_factory_dct_extraction_integration(embedder, sample_cover_png, sample_aes_payload_bitstream):
    embed_result = embedder.embed(sample_cover_png, sample_aes_payload_bitstream)

    strategy = EmbeddingFactory.get_strategy("DCT")
    assert isinstance(strategy, DCTSteganography)

    extract_result = strategy.extract(embed_result.stego_image_bytes)
    assert extract_result.recovered_payload == sample_aes_payload_bitstream
