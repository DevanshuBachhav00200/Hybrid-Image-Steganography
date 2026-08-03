from fastapi import APIRouter
from app.schemas.health import RootResponse, HealthResponse
from app.core.constants import TAG_SYSTEM, MSG_BACKEND_RUNNING, MSG_HEALTH_OK

router = APIRouter(tags=[TAG_SYSTEM])


@router.get("/", response_model=RootResponse, summary="Root Health Endpoint")
async def get_root() -> RootResponse:
    """
    Returns general backend operational status.
    """
    return RootResponse(message=MSG_BACKEND_RUNNING)


@router.get("/health", response_model=HealthResponse, summary="Service Health Check")
async def get_health() -> HealthResponse:
    """
    Returns service health check status.
    """
    return HealthResponse(status=MSG_HEALTH_OK)
