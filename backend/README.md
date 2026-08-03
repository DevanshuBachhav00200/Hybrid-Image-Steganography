# Hybrid Image Steganography System - Backend API

Production-ready FastAPI backend foundation for the **Hybrid Image Steganography System**, supporting multi-domain steganography (LSB, DCT, DWT) paired with AES encryption and Morse encoding.

---

## 📌 Project Overview

This backend service provides enterprise-grade, modular API endpoints for encoding text into stego-images and extracting hidden payloads. Designed with high scalability, versioned routing (`/api/v1`), custom middleware, structured logging via Loguru, and dependency injection.

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py        # GET / and GET /health
│   │   │   └── system.py        # GET /api/v1/status
│   │   ├── dependencies.py      # Common FastAPI dependencies
│   │   └── router.py            # API v1 main router
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Pydantic v2 settings & environment loader
│   │   ├── constants.py         # System constants & OpenAPI tags
│   │   ├── logging.py           # Centralized Loguru logger
│   │   └── security.py          # Security utilities placeholder
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── cors.py              # Dynamic CORS middleware
│   │   ├── error_handler.py     # Global exception handlers
│   │   └── request_logger.py    # Request performance & audit logger
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── health.py            # Health & status Pydantic schemas
│   │
│   ├── services/                # Business logic service placeholders
│   │   ├── __init__.py
│   │   ├── encoding_service.py
│   │   ├── decoding_service.py
│   │   ├── comparison_service.py
│   │   └── metrics_service.py
│   │
│   ├── processing/              # Steganography algorithm module packages
│   │   ├── __init__.py
│   │   ├── morse/
│   │   ├── aes/
│   │   ├── binary/
│   │   ├── lsb/
│   │   ├── dct/
│   │   ├── dwt/
│   │   ├── capacity/
│   │   ├── metrics/
│   │   └── image/
│   │
│   ├── models/                  # Database / domain models
│   │   └── __init__.py
│   │
│   ├── utils/                   # Shared helper utilities
│   │   └── __init__.py
│   │
│   ├── static/                  # Static file storage (.gitkeep)
│   ├── temp/                    # Temporary image upload storage (.gitkeep)
│   └── main.py                  # FastAPI application entry point
│
├── tests/                       # Automated test suite
│   ├── __init__.py
│   └── test_health.py
│
├── .env.example                 # Environment variable template
├── README.md                    # Backend documentation
├── requirements.txt             # Production & dev dependencies
└── run.py                       # CLI server launcher
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Python 3.12+
- `pip` package manager

### 2. Virtual Environment Setup

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Dependency Installation

Install backend runtime & testing dependencies:
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

---

## 🚀 Running the Server

Start the application server using `run.py`:
```bash
python run.py
```

Alternatively, launch using Uvicorn directly:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📖 Interactive API Documentation

Once the server is running, explore interactive Swagger UI and ReDoc documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Schema**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 🧪 Running Tests

Execute the automated test suite using `pytest`:
```bash
pytest tests/
```

---

## 🗺️ Future Development Roadmap

- **Phase 3A.2**: Morse Encoding & AES Encryption Processing Modules
- **Phase 3B**: Spatial & Frequency Domain Embedding Engine (LSB, DCT, DWT)
- **Phase 3C**: Metrics Evaluation Engine (PSNR, SSIM, MSE Calculation)
- **Phase 4**: Full Backend Service Integration with Next.js Frontend
