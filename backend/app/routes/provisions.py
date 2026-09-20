"""Provisions API route to retrieve verbatim statutory clauses."""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models import ProvisionResponse
from rtikit_ai.tools.lookup_provision import lookup_rti_provision

router = APIRouter()


@router.get("/provisions/{section}", response_model=List[ProvisionResponse])
async def get_provision(section: str):
    """Retrieve verbatim text for a given RTI Act section (e.g. 6, 7, 8, 19, 24)."""
    clauses = lookup_rti_provision(query="", section=section)
    if not clauses:
        raise HTTPException(status_code=404, detail=f"Section '{section}' not found in RTI Act 2005 corpus.")
    
    return [
        ProvisionResponse(
            id=c["id"],
            section=c["section"],
            sub=c.get("sub"),
            title=c["title"],
            text=c["text"],
            source_url=c["source_url"]
        ) for c in clauses
    ]
