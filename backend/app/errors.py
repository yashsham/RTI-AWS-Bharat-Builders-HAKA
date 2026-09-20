"""Friendly error handlers and exceptions for FastAPI backend."""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("rtikit.errors")


class RTIKitError(Exception):
    def __init__(self, message: str, status_code: int = 400, recoverable: bool = False):
        self.message = message
        self.status_code = status_code
        self.recoverable = recoverable
        super().__init__(message)


async def rtikit_error_handler(request: Request, exc: RTIKitError):
    logger.error(f"RTIKit Error: {exc.message} (status: {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "recoverable": exc.recoverable}
    )


async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "message": "An unexpected error occurred while processing your request. Please try again.",
            "recoverable": True
        }
    )
