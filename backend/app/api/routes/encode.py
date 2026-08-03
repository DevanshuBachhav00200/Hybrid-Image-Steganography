from fastapi import APIRouter, Depends, status
from app.schemas.requests import EncodeRequest
from app.schemas.responses import EncodeResponse
from app.services.encoding_service import EncodingService
from app.api.dependencies import get_encoding_service
from app.core.constants import TAG_ENCODING
from app.core.enums import StatusType
from app.core.logging import logger

router = APIRouter(prefix="/encode", tags=[TAG_ENCODING])


@router.post(
    "",
    response_model=EncodeResponse,
    status_code=status.HTTP_200_OK,
    summary="Encode Message into Stego Image (Placeholder)",
    description="Endpoint placeholder for encoding plain text into cover images using Morse, AES, and selected algorithm (LSB, DCT, DWT).",
)
async def encode_message(
    payload: EncodeRequest,
    service: EncodingService = Depends(get_encoding_service),
) -> EncodeResponse:
    """
    Accepts encoding payload, validates request schema, and invokes EncodingService.
    """
    logger.info(f"Received encode request for algorithm: {payload.algorithm}")
    try:
        return service.encode(payload)
    except NotImplementedError:
        logger.info(f"Encode operation for {payload.algorithm} returned Not Implemented status placeholder.")
        return EncodeResponse(
            status=StatusType.NOT_IMPLEMENTED,
            message="Encode endpoint ready.",
            stego_image=None,
            metrics=None,
        )
