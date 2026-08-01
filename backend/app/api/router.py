from fastapi import APIRouter
from app.api import health, encode, decode, compare, metrics, algorithms

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(encode.router)
api_router.include_router(decode.router)
api_router.include_router(compare.router)
api_router.include_router(metrics.router)
api_router.include_router(algorithms.router)
