from fastapi import APIRouter, Depends
from app.schemas.responses import (
    RootResponse,
    HealthResponse,
    StatusResponse,
    VersionResponse,
    DocsInfoResponse,
)
from app.core.config import Settings
from app.api.dependencies import get_settings
from app.core.constants import TAG_SYSTEM, MSG_BACKEND_RUNNING, MSG_HEALTH_OK, MSG_STATUS_ONLINE
from app.core.logging import logger

router = APIRouter(tags=[TAG_SYSTEM])


@router.get("/", response_model=RootResponse, summary="Root Operational Status")
async def get_root() -> RootResponse:
    """
    Returns general backend operational greeting message.
    """
    logger.info("Executing GET / root endpoint")
    return RootResponse(message=MSG_BACKEND_RUNNING)


@router.get("/health", response_model=HealthResponse, summary="Service Health Check")
async def get_health() -> HealthResponse:
    """
    Returns application health status for monitoring services.
    """
    logger.info("Executing GET /health check")
    return HealthResponse(status=MSG_HEALTH_OK)


@router.get("/status", response_model=StatusResponse, summary="API v1 Status")
async def get_system_status(settings: Settings = Depends(get_settings)) -> StatusResponse:
    """
    Returns status and active version of the backend API.
    """
    logger.info(f"Executing GET /api/v1/status [version={settings.API_VERSION}]")
    return StatusResponse(backend=MSG_STATUS_ONLINE, version=settings.API_VERSION)


@router.get("/version", response_model=VersionResponse, summary="API Version Information")
async def get_system_version(settings: Settings = Depends(get_settings)) -> VersionResponse:
    """
    Returns application name, active version, and versioned route prefix.
    """
    logger.info("Executing GET /api/v1/version")
    return VersionResponse(
        app_name=settings.APP_NAME,
        version=settings.API_VERSION,
        api_prefix=settings.API_V1_STR,
    )


@router.get("/docs-info", response_model=DocsInfoResponse, summary="API Documentation Endpoints")
async def get_docs_info(settings: Settings = Depends(get_settings)) -> DocsInfoResponse:
    """
    Returns URL locations for Swagger UI, ReDoc, and OpenAPI specification.
    """
    logger.info("Executing GET /api/v1/docs-info")
    return DocsInfoResponse(
        swagger_url="/docs",
        redoc_url="/redoc",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )
