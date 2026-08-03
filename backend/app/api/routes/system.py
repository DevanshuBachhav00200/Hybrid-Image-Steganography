from fastapi import APIRouter, Depends
from app.schemas.health import StatusResponse
from app.core.config import Settings
from app.api.dependencies import get_settings
from app.core.constants import TAG_SYSTEM, MSG_STATUS_ONLINE

router = APIRouter(prefix="/status", tags=[TAG_SYSTEM])


@router.get("", response_model=StatusResponse, summary="API Version Status")
async def get_system_status(settings: Settings = Depends(get_settings)) -> StatusResponse:
    """
    Returns API version and online status for the /api/v1 pipeline.
    """
    return StatusResponse(backend=MSG_STATUS_ONLINE, version=settings.API_VERSION)
