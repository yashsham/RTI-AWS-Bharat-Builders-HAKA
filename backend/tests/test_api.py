"""API endpoint tests for FastAPI backend."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model_provider" in data


def test_get_provision_section_6():
    response = client.get("/api/provisions/6")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(c["section"] == "6" for c in data)


def test_get_provision_invalid():
    response = client.get("/api/provisions/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_draft_validation():
    # Query too short (<10 chars)
    response = client.post("/api/rti/draft", json={"query": "short"})
    assert response.status_code == 422
