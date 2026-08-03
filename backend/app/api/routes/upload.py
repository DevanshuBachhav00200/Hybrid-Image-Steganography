from fastapi import APIRouter, Depends, UploadFile, File, status
from app.schemas.upload import UploadSuccessResponse, UploadErrorResponse
from app.services.image_service import ImageService
from app.api.dependencies import get_image_service
from app.core.constants import TAG_UPLOAD
from app.core.logging import logger

router = APIRouter(prefix="/upload", tags=[TAG_UPLOAD])


@router.post(
    "/image",
    response_model=UploadSuccessResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"model": UploadSuccessResponse, "description": "Image successfully validated, ingested, and stored temporarily."},
        400: {"model": UploadErrorResponse, "description": "Validation failure (unsupported format, corrupt file, oversized, invalid dimensions)."},
        422: {"model": UploadErrorResponse, "description": "Missing file payload or unprocessable multipart form."},
    },
    summary="Upload & Validate Image (PNG & BMP only)",
    description=(
        "Receives cover or stego image file, verifies magic byte signatures, validates structural integrity "
        "and dimension boundaries (PNG and BMP formats strictly supported; JPEG/WEBP/GIF rejected), "
        "stores file temporarily in app/temp/uploads/, and returns extracted image metadata with unique upload_id."
    ),
)
async def upload_image(
    file: UploadFile = File(..., description="Multipart image file (PNG or BMP format only)"),
    image_service: ImageService = Depends(get_image_service),
) -> UploadSuccessResponse:
    """
    Ingests uploaded image via multipart form data, validates format and structural integrity,
    extracts metadata, and stores temporary file.
    """
    filename = file.filename or "uploaded_image.png"
    logger.info(f"Executing POST /api/v1/upload/image for filename '{filename}'")

    file_bytes = await file.read()

    # Upload, validate, extract metadata, and save temporary file
    upload_id, metadata, _ = image_service.upload_image(file_bytes=file_bytes, filename=filename)

    return UploadSuccessResponse(
        success=True,
        upload_id=upload_id,
        filename=filename,
        metadata=metadata,
    )
