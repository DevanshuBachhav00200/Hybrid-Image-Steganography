from fastapi import APIRouter, Depends, status
from app.schemas.requests import DecodeRequest
from app.schemas.responses import DecodeResponse
from app.services.decoding_service import DecodingService
from app.api.dependencies import get_decoding_service
from app.core.constants import TAG_DECODING
from app.core.enums import StatusType
from app.core.logging import logger

router = APIRouter(prefix="/decode", tags=[TAG_DECODING])


@router.post(
    "",
    response_model=DecodeResponse,
    status_code=status.HTTP_200_OK,
    summary="Decode Message from Stego Image (Placeholder)",
    description="Endpoint placeholder for extracting and decrypting hidden messages from stego images using AES and Morse decoding.",
)
async def decode_message(
    payload: DecodeRequest,
    service: DecodingService = Depends(get_decoding_service),
) -> DecodeResponse:
    """
    Accepts decoding payload, validates request schema, and invokes DecodingService.
    """
    logger.info(f"Received decode request for algorithm: {payload.algorithm}")
    try:
        return service.decode(payload)
    except NotImplementedError:
        logger.info(f"Decode operation for {payload.algorithm} returned Not Implemented status placeholder.")
        return DecodeResponse(
            status=StatusType.NOT_IMPLEMENTED,
            message="Decode endpoint ready.",
            decoded_message=None,
        )
