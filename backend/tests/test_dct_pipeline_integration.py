"""
Integration tests for the complete DCT Steganography Pipeline (Phase 4B.5).
Verifies full roundtrip integration: Message -> Morse -> AES -> Binary -> Payload Builder -> DCT Embed -> DCT Extract -> Binary Parser -> AES Decrypt -> Morse Decode -> Plaintext.
"""

import io
import pytest
from PIL import Image

from app.processing.morse.service import MorseService
from app.processing.aes.service import AESService
from app.processing.binary.service import BinaryService
from app.processing.payload.builder import PayloadBuilder
from app.steganography.dct.embed import DCTEmbedder
from app.steganography.dct.extract import DCTExtractor
from app.steganography.dct.validator import DCTValidator
from app.steganography.factory import EmbeddingFactory
from app.steganography.dct.service import DCTSteganography


@pytest.fixture
def sample_cover_png():
    """Create a 256x256 RGB PNG cover image (ample capacity)."""
    img = Image.new("RGB", (256, 256), color=(120, 160, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_bmp_cover():
    """Create a 256x256 RGB BMP cover image."""
    img = Image.new("RGB", (256, 256), color=(100, 140, 180))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()


def test_dct_full_pipeline_roundtrip(sample_cover_png):
    """
    Verify complete integration of all Morse, AES, Binary, and DCT components.
    """
    original_message = "DCT INTEGRATION TEST SYSTEM ONLINE 2026"
    password = "SecurePassword123!"

    # 1. Morse Encoding
    morse_service = MorseService()
    morse_text = morse_service.encode(original_message)
    assert len(morse_text) > 0

    # 2. AES-256-GCM Encryption
    aes_service = AESService()
    aes_payload = aes_service.encrypt(morse_text, password)
    assert "ciphertext" in aes_payload

    # 3. Binary Serialization
    binary_service = BinaryService()
    binary_bitstream = binary_service.serialize(aes_payload)
    assert len(binary_bitstream) >= 128

    # 4. Payload Building
    payload_obj = PayloadBuilder.build(binary_bitstream)
    assert payload_obj.payload_size_bits == len(binary_bitstream)

    # 5. Factory Selection & DCT Embedding
    strategy = EmbeddingFactory.get_strategy("DCT")
    assert isinstance(strategy, DCTSteganography)

    stego_image_bytes, embed_meta = strategy.embed(
        sample_cover_png,
        payload_obj,
        options={"coefficients_per_block": 2, "quantization_step": 16.0}
    )
    assert embed_meta["success"] is True
    assert embed_meta["psnr_db"] > 35.0

    # 6. DCT Extraction
    extract_result = strategy.extract(
        stego_image_bytes,
        options={"coefficients_per_block": 2, "quantization_step": 16.0}
    )
    assert extract_result.success is True
    recovered_bitstream = extract_result.recovered_payload
    assert recovered_bitstream == binary_bitstream

    # 7. Binary Deserialization
    recovered_aes_payload = binary_service.deserialize(recovered_bitstream)
    assert recovered_aes_payload["ciphertext"] == aes_payload["ciphertext"]

    # 8. AES Decryption
    decrypted_morse_text = aes_service.decrypt(recovered_aes_payload, password)
    assert decrypted_morse_text == morse_text

    # 9. Morse Decoding
    recovered_message = morse_service.decode(decrypted_morse_text)

    # Final Verification
    assert recovered_message == original_message


def test_dct_bmp_pipeline_roundtrip(sample_bmp_cover):
    """
    Verify full integration using a BMP cover image format.
    """
    original_message = "BMP TEST 123"
    password = "TestPassword456!"

    morse_service = MorseService()
    aes_service = AESService()
    binary_service = BinaryService()
    strategy = EmbeddingFactory.get_strategy("DCT")

    morse_text = morse_service.encode(original_message)
    aes_payload = aes_service.encrypt(morse_text, password)
    binary_bitstream = binary_service.serialize(aes_payload)

    # Embed with 1 coefficient per block
    stego_image_bytes, embed_meta = strategy.embed(
        sample_bmp_cover,
        binary_bitstream,
        options={"coefficients_per_block": 2}
    )
    assert embed_meta["format"] == "BMP"

    # Extract
    extract_result = strategy.extract(stego_image_bytes, options={"coefficients_per_block": 2})
    recovered_aes = binary_service.deserialize(extract_result.recovered_payload)
    decrypted_morse = aes_service.decrypt(recovered_aes, password)
    recovered_message = morse_service.decode(decrypted_morse)

    assert recovered_message == original_message
