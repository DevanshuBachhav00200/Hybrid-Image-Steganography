# Payload Builder & Embedding Preparation Module

Production-grade payload packaging, validation, statistics calculation, and embedding preparation engine for the **Hybrid Image Steganography System**.

---

## 📌 Workflow

```
[Binary Bitstream]
       │
       ▼
PayloadBuilder.build()
       │
       ├── 1. Validate Bitstream Structure & Header Integrity (PayloadValidator)
       ├── 2. Calculate Statistical Metrics (PayloadStatistics)
       ├── 3. Build Metadata Parameters (PayloadMetadata)
       └── 4. Package Payload Object (PayloadStatus.READY)
       │
       ▼
EmbeddingManager.prepare_embedding()
       │
       ├── 1. Select Steganography Algorithm (LSB / DCT / DWT / AUTO)
       ├── 2. Build EmbeddingRequest Object
       └── 3. Dispatch to Low-Level Embedding Engine
```

---

## 📦 Data Models

- **Payload**: Central container holding `payload_id`, `timestamp`, `algorithm`, `binary_data`, `payload_size_bits`, `payload_size_bytes`, `header`, `metadata`, `statistics`, `status`.
- **PayloadMetadata**: Contains `algorithm`, `payload_length`, `header_length`, `binary_length`, `estimated_capacity`, `created_at`, `format_version`.
- **PayloadStatistics**: Statistical bit metrics (`total_bits`, `total_bytes`, `header_bits`, `payload_bits`, `preparation_time_ms`).
- **EmbeddingRequest**: Object dispatched to low-level embedding strategies (`payload_id`, `algorithm`, `binary_data`, `image_metadata`).

---

## 🚀 Usage Example

```python
from app.processing.payload.service import PayloadService
from app.core.enums import EmbeddingAlgorithm

payload_service = PayloadService()

# 1. Build Payload from Binary Bitstream
binary_bitstream = "0" * 128 + "1" * 128  # Sample bitstream string
payload = payload_service.build(binary_bitstream, EmbeddingAlgorithm.LSB)

# 2. Prepare Embedding Request
embedding_request = payload_service.prepare(payload)
print(embedding_request.algorithm)  # Output: EmbeddingAlgorithm.LSB
```

---

## 🧪 Testing

Execute unit tests:
```bash
pytest tests/test_payload.py
```
