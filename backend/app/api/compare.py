from fastapi import APIRouter

router = APIRouter(tags=["Analysis & Comparison"])

@router.post("/compare")
async def compare_images():
    """POST /api/compare endpoint placeholder."""
    return {"status": "Coming Soon"}
