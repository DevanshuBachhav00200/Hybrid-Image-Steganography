import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging import logger


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log details of incoming HTTP requests and processing duration.
    Excludes sensitive body parameters (passwords, plain text messages, image data) from logs.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_host = request.client.host if request.client else "unknown"
        
        logger.info(f"Incoming Request: {request.method} {request.url.path} from {client_host}")
        
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"Completed: {request.method} {request.url.path} | Status: {response.status_code} | Duration: {process_time:.2f}ms"
            )
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
            return response
        except Exception as exc:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Failed: {request.method} {request.url.path} | Duration: {process_time:.2f}ms | Error: {str(exc)}"
            )
            raise exc
