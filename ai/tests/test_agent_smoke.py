"""Smoke test suite verifying agent execution across 5 benchmark sample queries."""
import json
import asyncio
from pathlib import Path
from rtikit_ai.agent import run_rti_agent


async def _run_smoke_queries():
    samples_path = Path(__file__).parent / "sample_queries.json"
    with open(samples_path, "r", encoding="utf-8") as f:
        samples = json.load(f)

    for sample in samples:
        query = sample["query"]
        events = []
        async for event in run_rti_agent(query):
            events.append(event)
        
        step_events = [e for e in events if e.type == "step"]
        result_events = [e for e in events if e.type == "result"]
        done_events = [e for e in events if e.type == "done"]

        assert len(step_events) >= 2, f"Failed steps for query: {query}"
        assert len(result_events) == 1, f"Failed result for query: {query}"
        assert len(done_events) == 1, f"Failed done event for query: {query}"

        res = result_events[0].data
        assert res.suitable_for_rti is True
        assert res.authority is not None
        assert res.application is not None
        assert len(res.citations) > 0, f"No citations returned for query: {query}"
        assert len(res.explanations) > 0
        assert len(res.timeline) > 0
        assert len(res.appeal_plan) > 0


def test_agent_sample_queries():
    asyncio.run(_run_smoke_queries())
