"""FastAPI Main Application entry point for RTIKit Backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.logging import setup_logging
from app.errors import RTIKitError, rtikit_error_handler, generic_exception_handler
from app.routes import draft, provisions, health

logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting RTIKit Backend (Provider: {settings.model_provider}, Region: {settings.aws_region})")
    yield
    logger.info("Shutting down RTIKit Backend")


app = FastAPI(
    title="RTIKit API Server",
    description="FastAPI SSE Streaming Backend for RTIKit - AI-Powered Right to Information Assistant",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(RTIKitError, rtikit_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include Routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(provisions.router, prefix="/api", tags=["Provisions"])
app.include_router(draft.router, prefix="/api", tags=["RTI Draft"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
