# Processing Pipeline Orchestrator & End-to-End Integration

Production-grade preprocessing orchestrator coordinating steganographic encoding stages for the **Hybrid Image Steganography System**.

---

## 📌 Preprocessing Stage Sequence

```
Client Request (POST /api/v1/encode)
       │
       ▼
Stage 1: VALIDATE_REQUEST (Message length, password policy 8-128 chars, algorithm)
       │
       ▼
Stage 2: VALIDATE_IMAGE (Base64 data URL structure check)
       │
       ▼
Stage 3: PREPARE_IMAGE (Cover image pixel data verification)
       │
       ▼
Stage 4: MORSE_ENCODING (International Morse Code transformation)
       │
       ▼
Stage 5: AES_ENCRYPTION (AES-256-GCM + PBKDF2-HMAC-SHA256 key derivation)
       │
       ▼
Stage 6: BINARY_CONVERSION (16-byte fixed header + MSB bitstream string)
       │
       ▼
Stage 7: PAYLOAD_BUILDER (Payload packaging, metadata, statistics, capacity check)
       │
       ▼
Stage 8: IMAGE_EMBEDDING (EmbeddingManager -> MockEmbeddingService: status "READY")
       │
       ▼
Client Response (HTTP 200 OK - Status: READY)
```

---

## 📊 Pipeline Context & Telemetry

- **PipelineContext**: Holds `pipeline_id`, `execution_id`, `start_time`, `end_time`, `execution_time_ms`, `stage_history`, `errors`, `warnings`, `temp_data`.
- **Stage History Record**:
  ```json
  {
    "stage": "AES_ENCRYPTION",
    "status": "COMPLETED",
    "duration_ms": 3.45,
    "timestamp": 1785800000.0
  }
  ```

---

## 🏥 Diagnostics & Health Check

Run diagnostic health check:
```python
from app.processing.pipeline import check_pipeline_health

report = check_pipeline_health()
print(report["status"])  # Output: "HEALTHY"
```

---

## 🧪 Testing

Execute end-to-end integration test suite:
```bash
pytest tests/test_pipeline_e2e.py
```
