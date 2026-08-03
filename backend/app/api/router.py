from fastapi import APIRouter
from app.api.routes import system

api_router = APIRouter()

# Include versioned system routes under /api/v1
api_router.include_router(system.router)
