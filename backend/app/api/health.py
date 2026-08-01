from fastapi import APIRouter

router = APIRouter(tags=["Health & Version"])

@router.get("/health")
async def get_health():
    """GET /api/health endpoint placeholder."""
    return {"status": "Coming Soon"}

@router.get("/version")
async def get_version():
    """GET /api/version endpoint placeholder."""
    return {"status": "Coming Soon"}
