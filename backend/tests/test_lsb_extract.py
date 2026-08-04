"""
Unit tests for LSB Extraction Engine (Phase 4A.4).
"""

import io
import pytest
from PIL import Image

from app.steganography.lsb.embed import LSBEmbedder
from app.steganography.lsb.extract import LSBExtractor
from app.steganography.factory import EmbeddingFactory
from app.processing.binary.service import BinaryService
from app.models.stego import LSBExtractionResult
from app.core.exceptions import (
    NoHiddenDataException,
    CorruptedHeaderException,
    UnsupportedFormatException,
    InvalidImageException,
    CorruptedImageException,
)



@pytest.fixture
def embedder():
    return LSBEmbedder()


@pytest.fixture
def extractor():
    return LSBExtractor()


@pytest.fixture
def binary_service():
    return BinaryService()


@pytest.fixture
def sample_aes_payload_bitstream(binary_service):
    """Generate a valid binary bitstream with valid 16-byte HSTGO header."""
    aes_payload = {
        "ciphertext": "Q2lwaGVydGV4dERhdGExMjM0NTY=",
        "salt": "U2FsdEJ5dGVzMTZfQnl0ZQ==",
        "nonce": "Tm9uY2VCeXRlczEy",
        "authentication_tag": "QXV0aFRhZ0J5dGVzMTZfXw==",
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }
    return binary_service.serialize(aes_payload)


@pytest.fixture
def rgb_cover_bytes():
    """Create a 100x100 RGB PNG cover image."""
    img = Image.new("RGB", (100, 100), color=(120, 140, 160))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def rgba_cover_bytes():
    """Create a 60x60 RGBA PNG cover image."""
    img = Image.new("RGBA", (60, 60), color=(100, 200, 50, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def grayscale_cover_bytes():
    """Create a 100x100 Grayscale (L) PNG cover image."""
    img = Image.new("L", (100, 100), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def bmp_cover_bytes():
    """Create a 100x100 RGB BMP cover image."""
    img = Image.new("RGB", (100, 100), color=(150, 160, 170))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()


# 1. Test RGB End-to-End Embed -> Extract Bit Accuracy
def test_extract_rgb_png(embedder, extractor, rgb_cover_bytes, sample_aes_payload_bitstream):
    embed_result = embedder.embed(rgb_cover_bytes, sample_aes_payload_bitstream)
    stego_bytes = embed_result.stego_image_bytes

    extract_result = extractor.extract(stego_bytes)

    assert isinstance(extract_result, LSBExtractionResult)
    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream
    assert extract_result.payload_size_bits == len(sample_aes_payload_bitstream)
    assert extract_result.header_info["magic_number"] in ["STEGO", b"STEGO"]




# 2. Test RGBA End-to-End Embed -> Extract
def test_extract_rgba_png(embedder, extractor, rgba_cover_bytes, sample_aes_payload_bitstream):
    embed_result = embedder.embed(rgba_cover_bytes, sample_aes_payload_bitstream)
    extract_result = extractor.extract(embed_result.stego_image_bytes)

    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream


# 3. Test Grayscale End-to-End Embed -> Extract
def test_extract_grayscale_png(embedder, extractor, grayscale_cover_bytes, sample_aes_payload_bitstream):
    embed_result = embedder.embed(grayscale_cover_bytes, sample_aes_payload_bitstream)
    extract_result = extractor.extract(embed_result.stego_image_bytes)

    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream


# 4. Test BMP End-to-End Embed -> Extract
def test_extract_bmp(embedder, extractor, bmp_cover_bytes, sample_aes_payload_bitstream):
    embed_result = embedder.embed(bmp_cover_bytes, sample_aes_payload_bitstream)
    extract_result = extractor.extract(embed_result.stego_image_bytes)

    assert extract_result.success is True
    assert extract_result.recovered_payload == sample_aes_payload_bitstream


# 5. Integration with Phase 3 Binary Parser / Binary Service
def test_extract_and_binary_parse_integration(embedder, extractor, binary_service, rgb_cover_bytes, sample_aes_payload_bitstream):
    embed_result = embedder.embed(rgb_cover_bytes, sample_aes_payload_bitstream)
    extract_result = extractor.extract(embed_result.stego_image_bytes)

    # Pass recovered binary string directly to BinaryService deserializer
    deserialized_payload = binary_service.deserialize(extract_result.recovered_payload)

    assert deserialized_payload["ciphertext"] == "Q2lwaGVydGV4dERhdGExMjM0NTY="
    assert deserialized_payload["algorithm"] == "AES-256-GCM"


# 6. Test No Hidden Data Exception on Unmodified Clean Image
def test_extract_no_hidden_data(extractor, rgb_cover_bytes):
    with pytest.raises(NoHiddenDataException):
        extractor.extract(rgb_cover_bytes)


# 7. Test Unsupported Format Rejection (JPEG)
def test_extract_unsupported_format(extractor):
    img = Image.new("RGB", (100, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    jpeg_bytes = buf.getvalue()

    with pytest.raises(UnsupportedFormatException):
        extractor.extract(jpeg_bytes)


# 8. Test Invalid / Empty Image Handling
def test_extract_invalid_image(extractor):
    with pytest.raises(InvalidImageException):
        extractor.extract(b"")


# 9. Test Corrupted Header Handling
def test_extract_corrupted_header(embedder, extractor, rgb_cover_bytes, sample_aes_payload_bitstream):
    embed_result = embedder.embed(rgb_cover_bytes, sample_aes_payload_bitstream)
    stego_bytes = bytearray(embed_result.stego_image_bytes)

    # Corrupt byte in middle of stego stream
    stego_bytes[100] ^= 0xFF

    with pytest.raises((CorruptedHeaderException, NoHiddenDataException, InvalidImageException, CorruptedImageException)):
        extractor.extract(bytes(stego_bytes))



# 10. Test Integration with EmbeddingFactory Strategy Interface
def test_factory_lsb_extraction_integration(rgb_cover_bytes, sample_aes_payload_bitstream):
    strategy = EmbeddingFactory.get_strategy("LSB")

    stego_bytes, _ = strategy.embed(rgb_cover_bytes, sample_aes_payload_bitstream)
    extracted_payload_str = strategy.extract(stego_bytes)

    assert extracted_payload_str == sample_aes_payload_bitstream

