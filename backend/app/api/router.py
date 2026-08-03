from fastapi import APIRouter
from app.api.routes import system, upload, encode, decode, compare, metrics

api_router = APIRouter()

# Register all versioned routes under /api/v1
api_router.include_router(system.router)
api_router.include_router(upload.router)
api_router.include_router(encode.router)
api_router.include_router(decode.router)
api_router.include_router(compare.router)
api_router.include_router(metrics.router)
