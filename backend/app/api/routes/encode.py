from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.requests import EncodeRequest
from app.schemas.responses import EncodeResponse
from app.services.encoding_service import EncodingService
from app.api.dependencies import get_encoding_service
from app.core.logging import logger

router = APIRouter()


@router.post(
    "/encode",
    response_model=EncodeResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute Steganography Encoding Preprocessing Pipeline",
    description="""
    Executes the complete steganographic message preprocessing pipeline in sequence:
    
    1. **Request Validation**: Validates message length, password policy (8-128 chars), and algorithm choice (LSB/DCT/DWT).
    2. **Image Validation**: Checks base64 image payload format and structure.
    3. **Image Preparation**: Loads cover image buffer and verifies dimension constraints.
    4. **Morse Encoding**: Converts plain text message to International Morse Code sequence.
    5. **AES-256-GCM Encryption**: Encrypts Morse string using PBKDF2-HMAC-SHA256 password key.
    6. **Binary Conversion**: Serializes AES payload (ciphertext, salt, nonce, tag) into a 16-byte fixed header MSB bitstream.
    7. **Payload Builder**: Packages and validates bitstream into structured Payload container object.
    8. **Embedding Manager (Mock Ready)**: Prepares EmbeddingRequest and returns a READY status confirming preprocessing completion before Phase 3E pixel embedding.
    """,
    responses={
        200: {
            "description": "Encoding preprocessing completed successfully with READY status.",
            "content": {
                "application/json": {
                    "example": {
                        "status": "READY",
                        "message": "Payload prepared successfully and ready for steganographic embedding.",
                        "stego_image": None,
                        "metrics": {
                            "payload_id": "550e8400-e29b-41d4-a716-446655440000",
                            "algorithm": "LSB",
                            "status": "PREPARED",
                            "execution_time_ms": 12.45
                        }
                    }
                }
            }
        },
        400: {"description": "Validation error or invalid request payload."},
        500: {"description": "Internal server or pipeline stage processing error."}
    }
)
async def encode_message(
    request: EncodeRequest,
    encoding_service: EncodingService = Depends(get_encoding_service)
) -> EncodeResponse:
    """
    HTTP POST controller for steganographic message encoding preprocessing pipeline.
    """
    logger.info(f"POST /api/v1/encode requested for algorithm '{request.algorithm}'")
    try:
        return encoding_service.encode(request)
    except Exception as exc:
        logger.error(f"POST /api/v1/encode execution failed: {str(exc)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )
