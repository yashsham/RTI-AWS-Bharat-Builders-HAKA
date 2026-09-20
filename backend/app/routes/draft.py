"""Draft API route providing SSE event streaming for RTI agent execution."""
import json
import time
from collections import defaultdict
from fastapi import APIRouter, Request, HTTPException
from sse_starlette.sse import EventSourceResponse

from app.models import DraftRequest
from rtikit_ai.agent import run_rti_agent

router = APIRouter()

# In-memory rate limiting (10 requests per minute per IP)
IP_REQUEST_LOG = defaultdict(list)
RATE_LIMIT_MAX = 10
RATE_LIMIT_WINDOW = 60  # seconds


def check_rate_limit(client_ip: str):
    now = time.time()
    # Filter out requests older than window
    timestamps = [ts for ts in IP_REQUEST_LOG[client_ip] if now - ts < RATE_LIMIT_WINDOW]
    IP_REQUEST_LOG[client_ip] = timestamps

    if len(timestamps) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait a minute before making another request."
        )
    IP_REQUEST_LOG[client_ip].append(now)


@router.post("/rti/draft")
async def generate_rti_draft(request: Request, body: DraftRequest):
    """Stream RTI agent execution events via Server-Sent Events (SSE)."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip)

    options = {
        "state": body.state,
        "language": body.language,
        "applicant_is_bpl": body.applicant_is_bpl or False,
        "bpl_card_no": body.bpl_card_no
    }

    async def event_generator():
        try:
            async for event in run_rti_agent(body.query, options):
                event_type = event.type
                event_data = event.model_dump() if hasattr(event, "model_dump") else event.__dict__

                yield {
                    "event": event_type,
                    "data": json.dumps(event_data)
                }
        except Exception as err:
            yield {
                "event": "error",
                "data": json.dumps({"type": "error", "message": str(err), "recoverable": False})
            }
            yield {
                "event": "done",
                "data": json.dumps({"type": "done"})
            }

    return EventSourceResponse(event_generator())
