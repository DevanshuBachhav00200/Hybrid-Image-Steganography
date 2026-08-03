from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import (
    StegoAppException,
    ImageException,
    UnsupportedFormatException,
    CorruptedImageException,
    InvalidImageException,
    ImageTooLargeException,
    ImageDimensionException,
    UploadFailedException,
    ValidationException,
)
from app.core.logging import logger


def setup_exception_handlers(app: FastAPI) -> None:
    """
    Registers global exception handlers enforcing structured JSON error responses.
    """

    @app.exception_handler(ImageException)
    async def image_exception_handler(request: Request, exc: ImageException):
        logger.warning(f"Image Management Exception on {request.url.path}: {exc.message}")
        code_str = exc.__class__.__name__.replace("Exception", "").upper()
        if not code_str:
            code_str = "IMAGE_ERROR"
            
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": {
                    "code": code_str,
                    "message": exc.message,
                }
            },
        )

    @app.exception_handler(ValidationException)
    async def custom_validation_exception_handler(request: Request, exc: ValidationException):
        logger.warning(f"ValidationException on {request.url.path}: {exc.message}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": exc.message,
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
        first_msg = "Invalid upload payload or missing file."
        if exc.errors():
            first_msg = exc.errors()[0].get("msg", first_msg)
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_FAILED",
                    "message": first_msg,
                }
            },
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        logger.warning(f"HTTP {exc.status_code} on {request.url.path}: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": f"HTTP_{exc.status_code}",
                    "message": str(exc.detail),
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An internal server error occurred.",
                }
            },
        )
