from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.logging import logger


def setup_exception_handlers(app: FastAPI) -> None:
    """
    Registers global exception handlers for standardized JSON error responses.
    """
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        logger.warning(f"HTTP {exc.status_code} exception on {request.url.path}: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.status_code,
                    "message": exc.detail,
                    "type": "HTTPException"
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": "Internal server error occurred.",
                    "type": "InternalServerError"
                }
            },
        )
