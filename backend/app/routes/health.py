"""Health check endpoint route."""
from fastapi import APIRouter
from app.models import HealthResponse
from app.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        version="0.1.0",
        model_provider=settings.model_provider
    )
