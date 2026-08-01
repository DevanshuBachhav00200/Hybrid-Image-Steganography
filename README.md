# Hybrid Image Steganography System

A robust, multi-layered steganography and encryption platform integrating spatial domain (LSB), frequency domain (DCT, DWT), payload encoding (Morse Code), and standard cryptography (AES-256).

This repository contains a modular FastAPI backend and a Next.js 15 App Router frontend designed for independent or containerized execution.

---

## System Architecture Overview

```
Hybrid-Image-Steganography/
├── backend/                  # FastAPI Python backend application
│   ├── app/
│   │   ├── algorithms/       # Steganography & Crypto algorithm placeholders
│   │   │   ├── aes/          # AES-256 encryption engine stub
│   │   │   ├── binary/       # Binary payload conversion utilities stub
│   │   │   ├── dct/          # Discrete Cosine Transform stego stub
│   │   │   ├── dwt/          # Discrete Wavelet Transform stego stub
│   │   │   ├── lsb/          # Least Significant Bit spatial stego stub
│   │   │   └── morse/        # Morse code encoding/decoding stub
│   │   ├── api/              # FastAPI router & endpoint handlers
│   │   ├── config/           # Pydantic environment configuration
│   │   ├── core/             # Custom exception handlers & logging
│   │   ├── metrics/          # PSNR, SSIM, MSE metrics evaluator
│   │   ├── models/           # Domain data models
│   │   ├── schemas/          # API request & response schemas
│   │   ├── services/         # Steganography pipeline service logic
│   │   └── utils/            # Image processing helper functions
│   ├── tests/                # Pytest unit & endpoint tests
│   ├── main.py               # FastAPI application entry point
│   ├── pyproject.toml        # Python project metadata
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Next.js 15 App Router frontend application
│   ├── src/
│   │   ├── app/              # Next.js pages & layout
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── encode/page.tsx   # Encode payload placeholder page
│   │   │   ├── decode/page.tsx   # Decode stego image placeholder page
│   │   │   ├── compare/page.tsx  # Image comparison placeholder page
│   │   │   ├── dashboard/page.tsx# Dashboard & telemetry page
│   │   │   ├── about/page.tsx    # Project overview page
│   │   │   └── documentation/page.tsx # API docs & specs page
│   │   └── components/       # Reusable React components (Navbar, Footer, Cards)
│   ├── package.json          # Node.js dependencies & scripts
│   ├── tsconfig.json         # TypeScript configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── Dockerfile.backend        # Docker build instructions for backend
├── Dockerfile.frontend       # Docker build instructions for frontend
└── docker-compose.yml        # Multi-container orchestration
```

---

## Local Development Instructions

### Prerequisites
- **Python**: Version 3.12 or higher
- **Node.js**: Version 20 or higher (with `npm`)
- **Docker & Docker Compose**: (Optional, for containerized run)

---

### 1. Running the Backend Independently

Navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a Python virtual environment:
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

Set up local environment file:
```bash
cp .env.example .env
```

Start the FastAPI development server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- **API Base URL**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/api/docs`
- **ReDoc Specifications**: `http://localhost:8000/api/redoc`

Run backend tests:
```bash
pytest tests/
```

---

### 2. Running the Frontend Independently

Navigate to the `frontend` directory:
```bash
cd frontend
```

Install frontend dependencies:
```bash
npm install
```

Set up local environment file:
```bash
cp .env.example .env.local
```

Start the Next.js development server:
```bash
npm run dev
```

- **Frontend App URL**: `http://localhost:3000`

Run TypeScript type verification:
```bash
npm run type-check
```

---

### 3. Running Containerized with Docker Compose

To start both services simultaneously in isolated containers from the root directory:

```bash
docker-compose up --build
```

To stop containers:
```bash
docker-compose down
```

---

## API Endpoints Reference

| HTTP Method | Endpoint Path | Description | Tag |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | Health & Version |
| `GET` | `/api/version` | Service version information | Health & Version |
| `GET` | `/api/algorithms` | List supported steganography algorithms | Metadata & Specs |
| `POST` | `/api/encode` | Encode secret payload into cover image | Steganography Operations |
| `POST` | `/api/decode` | Extract hidden payload from stego image | Steganography Operations |
| `POST` | `/api/compare` | Compare cover vs stego image quality | Analysis & Comparison |
| `POST` | `/api/metrics` | Compute evaluation metrics (PSNR, SSIM, MSE) | Analysis & Comparison |

---

## Frontend Page Routes

| Route Path | Page Description |
| :--- | :--- |
| `/` | **Home**: Hero section, architecture overview, module cards |
| `/encode` | **Encode**: Image upload & payload encoding configuration interface |
| `/decode` | **Decode**: Stego image payload extraction interface |
| `/compare` | **Compare**: Side-by-side visual comparison & quality metrics |
| `/dashboard` | **Dashboard**: System telemetry, server status & algorithm specs |
| `/about` | **About**: Project research mission & multi-layer steganography concepts |
| `/documentation` | **Documentation**: API endpoint reference & interactive OpenAPI link |

---

## License

MIT License.
