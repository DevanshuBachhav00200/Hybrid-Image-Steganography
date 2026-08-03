import pytest
from app.core.enums import EmbeddingAlgorithm, PayloadStatus
from app.processing.payload.service import PayloadService
from app.processing.payload.builder import PayloadBuilder
from app.processing.payload.validator import validate_payload_structure
from app.processing.payload.capacity import CapacityEstimator
from app.processing.payload.embedding_manager import EmbeddingManager
from app.processing.payload.exceptions import (
    PayloadValidationException,
    AlgorithmSelectionException,
)
from app.schemas.upload import ImageMetadata
from app.processing.binary.service import BinaryService


@pytest.fixture
def payload_service():
    return PayloadService()


@pytest.fixture
def sample_bitstream():
    # Build a valid binary bitstream using BinaryService
    binary_service = BinaryService()
    aes_payload = {
        "ciphertext": "Q2lwaGVydGV4dERhdGExMjM=",
        "salt": "U2FsdEJ5dGVzMTZfQnl0ZQ==",
        "nonce": "Tm9uY2VCeXRlczEy",
        "authentication_tag": "QXV0aFRhZ0J5dGVzMTZfXw==",
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }
    return binary_service.serialize(aes_payload)


# 1. Payload Creation & Packaging
def test_payload_building(payload_service, sample_bitstream):
    payload = payload_service.build(sample_bitstream, EmbeddingAlgorithm.LSB)

    assert payload.payload_id is not None
    assert payload.algorithm == EmbeddingAlgorithm.LSB
    assert payload.status == PayloadStatus.READY
    assert payload.payload_size_bits == len(sample_bitstream)
    assert payload.header is not None
    assert payload.metadata.algorithm == EmbeddingAlgorithm.LSB
    assert payload.statistics.total_bits == len(sample_bitstream)


# 2. Validation Functionality
def test_payload_validation(sample_bitstream):
    result = validate_payload_structure(sample_bitstream)
    assert result.is_valid is True
    assert len(result.errors) == 0


def test_invalid_payload_validation(payload_service):
    with pytest.raises(PayloadValidationException):
        payload_service.build("0101")  # Less than 128 bits header limit


# 3. Capacity Estimator Placeholders
def test_capacity_estimator():
    img_meta = ImageMetadata(
        upload_id="test",
        filename="test.png",
        extension="PNG",
        width=1000,
        height=1000,
        channels=3,
        color_mode="RGB",
        bit_depth=8,
        file_size_bytes=3000000,
        mime_type="image/png",
        upload_time="2026-08-03T20:00:00Z",
    )
    capacities = CapacityEstimator.estimate_best(img_meta)

    assert capacities["LSB"] == 1000 * 1000 * 3
    assert capacities["DCT"] > 0
    assert capacities["DWT"] > 0


# 4. Algorithm Selection & Embedding Preparation
def test_embedding_manager(payload_service, sample_bitstream):
    payload = payload_service.build(sample_bitstream, EmbeddingAlgorithm.AUTO)
    manager = EmbeddingManager()

    selected_alg = manager.select_algorithm(payload, payload.algorithm)
    assert selected_alg == EmbeddingAlgorithm.LSB  # AUTO resolves to LSB

    request = manager.prepare_embedding(payload)
    assert request.payload_id == payload.payload_id
    assert request.algorithm == EmbeddingAlgorithm.LSB
    assert request.binary_data == sample_bitstream


# 5. Unsupported Algorithm Selection Rejection
def test_unsupported_algorithm_selection(payload_service, sample_bitstream):
    payload = payload_service.build(sample_bitstream, EmbeddingAlgorithm.LSB)
    manager = EmbeddingManager()

    with pytest.raises(AlgorithmSelectionException):
        manager.select_algorithm(payload, "INVALID_ALG")


# 6. Payload Service Finalization
def test_payload_finalization(payload_service, sample_bitstream):
    payload = payload_service.build(sample_bitstream, EmbeddingAlgorithm.LSB)
    assert payload.status == PayloadStatus.READY

    finalized = payload_service.finalize(payload)
    assert finalized.status == PayloadStatus.PREPARED
