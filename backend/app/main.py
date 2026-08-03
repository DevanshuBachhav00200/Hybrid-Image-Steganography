from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.core.config import settings
from app.core.constants import (
    TAG_SYSTEM,
    TAG_ENCODING,
    TAG_DECODING,
    TAG_COMPARISON,
    TAG_METRICS,
)
from app.core.logging import logger
from app.middleware.cors import setup_cors
from app.middleware.request_logger import RequestLoggerMiddleware
from app.middleware.error_handler import setup_exception_handlers
from app.api.routes import health
from app.api.router import api_router

# Define OpenAPI tags metadata for documentation grouping
tags_metadata = [
    {
        "name": TAG_SYSTEM,
        "description": "System health, configuration, and API status endpoints.",
    },
    {
        "name": TAG_ENCODING,
        "description": "Text to Morse, AES encryption, and image embedding operations (Future Phase).",
    },
    {
        "name": TAG_DECODING,
        "description": "Stego image extraction, AES decryption, and Morse decoding operations (Future Phase).",
    },
    {
        "name": TAG_COMPARISON,
        "description": "Steganography algorithm comparison and performance evaluation (Future Phase).",
    },
    {
        "name": TAG_METRICS,
        "description": "Image quality metrics calculation including PSNR, SSIM, and MSE (Future Phase).",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    logger.info(f"Starting {settings.APP_NAME} v{settings.API_VERSION}")
    logger.info(f"Environment: DEBUG={settings.DEBUG}, LOG_LEVEL={settings.LOG_LEVEL}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


# Instantiate FastAPI Application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="Professional backend API for Hybrid Image Steganography using Morse Encoding, AES Encryption, and Multi-Domain Image Embedding.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
)

# Register Middlewares
setup_cors(app)
app.add_middleware(RequestLoggerMiddleware)
setup_exception_handlers(app)

# Mount Health & System Routes
app.include_router(health.router)
app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
