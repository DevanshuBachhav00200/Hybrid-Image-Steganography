"""
End-to-End Pipeline Integration tests for LSB Steganography System (Phase 4A.5).
Verifies complete flow: Message -> Morse -> AES -> Binary -> Payload -> LSB Embed -> Stego Image -> LSB Extract -> Binary Parse -> AES Decrypt -> Morse Decode -> Original Message.
"""

import io
import pytest
from PIL import Image

from app.processing.morse.service import MorseService
from app.processing.aes.service import AESService
from app.processing.binary.service import BinaryService

from app.processing.payload.builder import PayloadBuilder
from app.steganography.lsb.embed import LSBEmbedder
from app.steganography.lsb.extract import LSBExtractor
from app.steganography.lsb.validator import LSBValidator



@pytest.fixture
def sample_cover_image():
    """Create a 150x150 RGB cover PNG image."""
    img = Image.new("RGB", (150, 150), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_bmp_cover_image():
    """Create a 150x150 RGB BMP cover image."""
    img = Image.new("RGB", (150, 150), color=(80, 120, 160))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()


# 1. Full Steganography Component Pipeline Roundtrip
def test_full_steganography_pipeline_roundtrip(sample_cover_image):
    original_message = "CONFIDENTIAL FINAL YEAR PROJECT PROJECT STATUS OK 2026"
    password = "SuperSecretPassword123!"

    # Step 1: Morse Encoding
    morse_service = MorseService()
    morse_text = morse_service.encode(original_message)
    assert len(morse_text) > 0

    # Step 2: AES-256-GCM Encryption
    aes_service = AESService()
    aes_payload = aes_service.encrypt(morse_text, password)

    assert "ciphertext" in aes_payload

    # Step 3: Binary Serialization
    binary_service = BinaryService()
    binary_bitstream = binary_service.serialize(aes_payload)
    assert len(binary_bitstream) >= 128

    # Step 4: Payload Building
    payload_obj = PayloadBuilder.build(binary_bitstream)
    assert payload_obj.payload_size_bits == len(binary_bitstream)

    # Step 5: LSB Embedding
    embedder = LSBEmbedder()
    embed_result = embedder.embed(sample_cover_image, payload_obj.binary_data)
    assert embed_result.success is True
    stego_image_bytes = embed_result.stego_image_bytes

    # Step 6: Validate Stego Postconditions (PSNR & Fidelity)
    validator = LSBValidator()
    val_result = validator.validate_postconditions(sample_cover_image, stego_image_bytes, min_psnr_db=40.0)
    assert val_result["valid"] is True
    assert val_result["psnr_db"] > 40.0

    # Step 7: LSB Extraction
    extractor = LSBExtractor()
    extract_result = extractor.extract(stego_image_bytes)
    assert extract_result.success is True
    recovered_bitstream = extract_result.recovered_payload
    assert recovered_bitstream == binary_bitstream

    # Step 8: Binary Deserialization
    recovered_aes_payload = binary_service.deserialize(recovered_bitstream)
    assert recovered_aes_payload["ciphertext"] == aes_payload["ciphertext"]

    # Step 9: AES-256-GCM Decryption
    decrypted_morse_text = aes_service.decrypt(recovered_aes_payload, password)
    assert decrypted_morse_text == morse_text

    # Step 10: Morse Decoding
    recovered_message = morse_service.decode(decrypted_morse_text)

    # Final Verification: Recovered message MUST equal original message bit-for-bit
    assert recovered_message == original_message


# 2. BMP Cover Image Pipeline Roundtrip
def test_bmp_pipeline_roundtrip(sample_bmp_cover_image):
    original_message = "TEST BMP STEGANOGRAPHY ROUNDTRIP 123"
    password = "BmpTestPassword456!"

    morse_service = MorseService()
    aes_service = AESService()
    binary_service = BinaryService()

    embedder = LSBEmbedder()
    extractor = LSBExtractor()

    morse_text = morse_service.encode(original_message)
    aes_payload = aes_service.encrypt(morse_text, password)
    binary_bitstream = binary_service.serialize(aes_payload)

    embed_result = embedder.embed(sample_bmp_cover_image, binary_bitstream)
    assert embed_result.format == "BMP"

    extract_result = extractor.extract(embed_result.stego_image_bytes)
    recovered_aes = binary_service.deserialize(extract_result.recovered_payload)
    decrypted_morse = aes_service.decrypt(recovered_aes, password)
    recovered_msg = morse_service.decode(decrypted_morse)

    assert recovered_msg == original_message
