from fastapi import APIRouter, Depends, status
from app.schemas.requests import CompareRequest
from app.schemas.responses import CompareResponse
from app.services.comparison_service import ComparisonService
from app.api.dependencies import get_comparison_service
from app.core.constants import TAG_COMPARISON
from app.core.enums import StatusType
from app.core.logging import logger

router = APIRouter(prefix="/compare", tags=[TAG_COMPARISON])


@router.post(
    "",
    response_model=CompareResponse,
    status_code=status.HTTP_200_OK,
    summary="Compare Steganography Algorithms (Placeholder)",
    description="Endpoint placeholder for comparing LSB, DCT, and DWT algorithms across capacity, speed, and distortion metrics.",
)
async def compare_algorithms(
    payload: CompareRequest,
    service: ComparisonService = Depends(get_comparison_service),
) -> CompareResponse:
    """
    Accepts comparison payload, validates request schema, and invokes ComparisonService.
    """
    logger.info("Received algorithm comparison request")
    try:
        return service.compare(payload)
    except NotImplementedError:
        logger.info("Compare operation returned Not Implemented status placeholder.")
        return CompareResponse(
            status=StatusType.NOT_IMPLEMENTED,
            message="Compare endpoint ready.",
            results=None,
        )
