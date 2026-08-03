from typing import Any, Optional, Dict
from fastapi.responses import JSONResponse
from fastapi import status
from app.core.enums import StatusType


def success_response(
    data: Optional[Any] = None,
    message: str = "Operation completed successfully.",
    status_code: int = status.HTTP_200_OK,
) -> JSONResponse:
    """Helper utility for generating standardized JSON success responses."""
    content: Dict[str, Any] = {
        "status": StatusType.SUCCESS,
        "message": message,
    }
    if data is not None:
        content["data"] = data
    return JSONResponse(status_code=status_code, content=content)


def error_response(
    message: str = "An error occurred.",
    code: int = status.HTTP_400_BAD_REQUEST,
    error_type: str = "BadRequest",
    details: Optional[Any] = None,
) -> JSONResponse:
    """Helper utility for generating standardized JSON error responses."""
    return JSONResponse(
        status_code=code,
        content={
            "error": {
                "code": code,
                "message": message,
                "type": error_type,
                "details": details,
            }
        },
    )


def validation_response(
    message: str = "Validation failed.",
    details: Optional[Any] = None,
) -> JSONResponse:
    """Helper utility for generating standardized validation error responses."""
    return error_response(
        message=message,
        code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_type="ValidationException",
        details=details,
    )


def not_implemented_response(
    message: str = "Feature endpoint ready but not implemented yet.",
) -> JSONResponse:
    """Helper utility for generating standardized placeholder responses."""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": StatusType.NOT_IMPLEMENTED,
            "message": message,
            "data": None,
        },
    )
