# Hybrid Image Steganography System - Backend API

Production-ready FastAPI backend for the **Hybrid Image Steganography System**, supporting multi-domain steganography (LSB, DCT, DWT) paired with AES encryption and Morse encoding.

---

## 📌 Project Overview

This backend service provides enterprise-grade, modular API endpoints for image uploading, metadata extraction, text-to-stego image encoding, and extraction. Designed with high scalability, versioned routing (`/api/v1`), custom middleware, structured logging via Loguru, Image Management Engine, and dependency injection.

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py        # GET / and GET /health
│   │   │   ├── system.py        # GET /api/v1/status, /version, /docs-info
│   │   │   ├── upload.py        # POST /api/v1/upload/image (PNG & BMP only)
│   │   │   ├── encode.py        # POST /api/v1/encode
│   │   │   ├── decode.py        # POST /api/v1/decode
│   │   │   ├── compare.py       # POST /api/v1/compare
│   │   │   └── metrics.py       # GET /api/v1/metrics, /history, /system
│   │   ├── dependencies.py      # DI providers for all services
│   │   └── router.py            # API v1 main router
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Settings & upload bounds configuration
│   │   ├── constants.py         # Supported formats & dimension limits
│   │   ├── enums.py             # AlgorithmType, OperationType, UploadStatus
│   │   ├── exceptions.py        # Custom exception hierarchy
│   │   ├── logging.py           # Loguru structured logging
│   │   └── security.py          # Security utilities
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── cors.py              # Dynamic CORS setup
│   │   ├── error_handler.py     # Standardized JSON error response format
│   │   └── request_logger.py    # Sanitized request audit logger
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── requests.py          # Request validation schemas
│   │   ├── responses.py         # Standardized JSON response models
│   │   └── upload.py            # ImageMetadata, UploadSuccessResponse
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── image_service.py     # Image Management Engine
│   │   ├── cleanup_service.py   # Temp file expiration purge service
│   │   ├── encoding_service.py
│   │   ├── decoding_service.py
│   │   ├── comparison_service.py
│   │   ├── metrics_service.py
│   │   ├── validation_service.py
│   │   ├── health_service.py
│   │   └── report_service.py
│   │
│   ├── processing/              # Processing modules & Strategy factories
│   │   ├── __init__.py
│   │   ├── interfaces.py        # Abstract Strategy interfaces (ABC)
│   │   ├── factories.py         # Strategy Factory classes
│   │   ├── image/loader.py      # ImageLoader service
│   │   ├── morse/
│   │   ├── aes/
│   │   ├── binary/
│   │   ├── embedding/
│   │   ├── lsb/
│   │   ├── dct/
│   │   ├── dwt/
│   │   ├── capacity/
│   │   └── metrics/
│   │
│   ├── temp/
│   │   └── uploads/             # Temporary image upload storage
│   └── main.py                  # FastAPI application entry point
│
├── tests/                       # Automated Test Suite (27 Test Cases)
│   ├── __init__.py
│   ├── test_health.py
│   ├── test_routes.py
│   ├── test_upload.py           # Image management & upload engine tests
│   ├── test_encoding_service.py
│   ├── test_decoding_service.py
│   ├── test_metrics_service.py
│   └── test_validation_service.py
│
├── .env.example                 # Environment configuration template
├── README.md                    # Documentation
├── requirements.txt             # Dependencies
└── run.py                       # CLI server runner
```

---

## 🖼️ Supported Image Formats & Validation Bounds

### Supported Formats
- **PNG** (`.png` / `image/png` / `b"\x89PNG\r\n\x1a\n"`)
- **BMP** (`.bmp` / `image/bmp` / `b"BM"`)

### Rejected Formats
Uploads containing JPEG, GIF, TIFF, WEBP, SVG, HEIC, or RAW formats are rejected with an HTTP 400 `UNSUPPORTEDFORMAT` error response.

### Image Limits Configuration
- **Max File Size**: 10 MB (`10,485,760` bytes)
- **Min Dimensions**: 10 × 10 pixels
- **Max Dimensions**: 8192 × 8192 pixels
- **Max Megapixels**: 64 MP

---

## 📤 Image Upload API

### `POST /api/v1/upload/image`
Accepts `UploadFile` via `multipart/form-data`.

**Success Response (HTTP 200):**
```json
{
  "success": true,
  "upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "cover.png",
  "metadata": {
    "upload_id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "cover.png",
    "extension": "PNG",
    "width": 1920,
    "height": 1080,
    "channels": 4,
    "color_mode": "RGBA",
    "bit_depth": 8,
    "file_size_bytes": 2457600,
    "mime_type": "image/png",
    "upload_time": "2026-08-03T20:00:00Z"
  }
}
```

**Validation Error Response (HTTP 400 / 422):**
```json
{
  "success": false,
  "error": {
    "code": "UNSUPPORTEDFORMAT",
    "message": "Unsupported file format '.jpg'. Only PNG and BMP images are supported."
  }
}
```

---

## 🧹 Temporary Storage & Cleanup Process

1. Uploaded images are written to `app/temp/uploads/{upload_id}_{filename}`.
2. File paths are never directly accessed by processing algorithms; modules query images via `ImageService`.
3. `CleanupService` automatically purges expired temporary upload files exceeding `TEMP_FILE_EXPIRATION_SECONDS` (default: 3600 seconds / 1 hour).

---

## 🛠️ Installation & Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Running Tests
```bash
cd backend
python -m pytest tests/
```

---

## 📖 Interactive API Documentation

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
