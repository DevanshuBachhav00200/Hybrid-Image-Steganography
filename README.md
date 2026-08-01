# Hybrid Image Steganography System

> **Enterprise-Grade Final Year Engineering Project**
> Title: *Hybrid Image Steganography System Using Morse Code Encoding and Multi-Domain Data Embedding Techniques*

---

## 📌 Architectural Overview

This system provides an end-to-end framework for multi-domain data hiding in cover images, combining pre-encoding techniques with spatial (LSB) and frequency domain (DCT, DWT) steganographic embedding.

```
                  ┌─────────────────────────────────────────┐
                  │               User Input                │
                  └────────────────────┬────────────────────┘
                                       │
                         ┌─────────────▼─────────────┐
                         │   Morse Code Pre-Encoding │
                         └─────────────┬─────────────┘
                                       │
                         ┌─────────────▼─────────────┐
                         │    AES-256 Encryption     │
                         └─────────────┬─────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            │                                                     │
┌───────────▼───────────┐                             ┌───────────▼───────────┐
│ Spatial Domain (LSB)  │                             │ Frequency Domain      │
└───────────────────────┘                             │   (DCT / DWT)         │
                                                      └───────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19, TailwindCSS, Lucide Icons, ShadCN UI Design Tokens
- **State & Routing**: TypeScript, React Hook Form, Axios
- **Data Visualization**: Recharts
- **Animations**: Framer Motion

### Backend
- **Framework**: Python 3.12, FastAPI, Pydantic v2
- **Image Processing**: OpenCV (`opencv-python`), PyWavelets (`PyWavelets`), Scikit-Image (`scikit-image`), Pillow (`PIL`)
- **Cryptography & Math**: PyCryptodome, NumPy

---

## 📂 Enterprise Folder Architecture

```
Hybrid-Image-Steganography/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI Endpoint Routers
│   │   ├── core/            # App Logging & Base Exceptions
│   │   ├── config/          # Pydantic Settings & Config
│   │   ├── services/        # Orchestration Service Interfaces
│   │   ├── algorithms/      # Modular Domain Algorithms Stubs
│   │   │   ├── morse/
│   │   │   ├── aes/
│   │   │   ├── binary/
│   │   │   ├── lsb/
│   │   │   ├── dct/
│   │   │   └── dwt/
│   │   ├── metrics/         # PSNR, SSIM, MSE Evaluators
│   │   ├── models/          # Domain Data Models
│   │   ├── schemas/         # Request & Response Pydantic Models
│   │   └── utils/           # Image Processing Helpers
│   ├── tests/               # Test Suite
│   ├── main.py              # Application Entrypoint
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js App Router (Pages & Layouts)
│   ├── components/          # Reusable UI & Layout Components
│   ├── features/            # Domain Feature Modules
│   ├── hooks/               # Custom React Hooks
│   ├── services/            # Axios API Client & Services
│   ├── styles/              # Global CSS & Design System
│   ├── types/               # TypeScript Definitions
│   ├── utils/               # Helper Functions
│   └── package.json
├── docker-compose.yml
├── Dockerfile.backend
└── Dockerfile.frontend
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose (Optional)

### Running with Docker Compose
```bash
docker-compose up --build
```
- **Frontend URL**: `http://localhost:3000`
- **Backend API Docs**: `http://localhost:8000/docs`

---

## 🧪 API Endpoints Overview

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health Check | Placeholder |
| `GET` | `/api/version` | API Versioning | Placeholder |
| `GET` | `/api/algorithms` | Supported Steganography Algorithms | Placeholder |
| `POST` | `/api/encode` | Embed Secret Message into Image | Placeholder |
| `POST` | `/api/decode` | Extract Secret Message from Image | Placeholder |
| `POST` | `/api/compare` | Visual & Statistical Image Comparison | Placeholder |
| `POST` | `/api/metrics` | Calculate PSNR, SSIM, MSE Metrics | Placeholder |

---

## 📜 License
Engineering Final Year Project Scaffolding. All Rights Reserved.
