from fastapi import APIRouter, Depends, status
from app.schemas.responses import MetricsResponse
from app.services.metrics_service import MetricsService
from app.api.dependencies import get_metrics_service
from app.core.constants import TAG_METRICS
from app.core.enums import StatusType
from app.core.logging import logger

router = APIRouter(prefix="/metrics", tags=[TAG_METRICS])


@router.get(
    "",
    response_model=MetricsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Image Quality & Distortion Metrics (Placeholder)",
    description="Endpoint placeholder for retrieving calculated PSNR, SSIM, and MSE metrics.",
)
async def get_metrics(
    service: MetricsService = Depends(get_metrics_service),
) -> MetricsResponse:
    """
    Returns image quality metrics placeholder response.
    """
    logger.info("Executing GET /api/v1/metrics")
    try:
        return service.calculate_metrics(None)
    except NotImplementedError:
        return MetricsResponse(
            status=StatusType.NOT_IMPLEMENTED,
            message="Metrics endpoint ready.",
            metrics=None,
        )


@router.get(
    "/history",
    response_model=MetricsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Metrics Evaluation History (Placeholder)",
    description="Endpoint placeholder for retrieving past evaluation metric history.",
)
async def get_metrics_history(
    service: MetricsService = Depends(get_metrics_service),
) -> MetricsResponse:
    """
    Returns metrics history placeholder response.
    """
    logger.info("Executing GET /api/v1/metrics/history")
    try:
        return service.get_history()
    except NotImplementedError:
        return MetricsResponse(
            status=StatusType.NOT_IMPLEMENTED,
            message="Metrics history endpoint ready.",
            metrics=None,
        )


@router.get(
    "/system",
    response_model=MetricsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Backend Telemetry & System Metrics (Placeholder)",
    description="Endpoint placeholder for system resource and telemetry metrics.",
)
async def get_system_telemetry(
    service: MetricsService = Depends(get_metrics_service),
) -> MetricsResponse:
    """
    Returns system telemetry metrics placeholder response.
    """
    logger.info("Executing GET /api/v1/metrics/system")
    try:
        return service.get_system_metrics()
    except NotImplementedError:
        return MetricsResponse(
            status=StatusType.NOT_IMPLEMENTED,
            message="System metrics endpoint ready.",
            metrics=None,
        )
