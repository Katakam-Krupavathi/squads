import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "FirstPR API"

def test_demo_repositories_endpoint():
    response = client.get("/api/demo-repositories")
    assert response.status_code == 200
    demos = response.json()
    assert len(demos) >= 2
    # Ensure demo 1 has both a beginner and a mislabelled issue
    demo1 = demos[0]
    assert len(demo1["ranked_issues"]) >= 2
    categories = [i["difficulty"]["category"] for i in demo1["ranked_issues"]]
    assert "Genuinely Beginner" in categories
    assert "Mislabelled" in categories

def test_cached_report_retrieval():
    response = client.get("/api/reports/chalk-chalk")
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["owner"] == "chalk"
    assert data["environment"]["status"] == "Verified"

def test_walkthrough_endpoint():
    response = client.post("/api/reports/chalk-chalk/issues/582/walkthrough")
    assert response.status_code == 200
    wt = response.json()
    assert wt["issue_number"] == 582
    assert wt["grounding_validated"] is True
    assert len(wt["files_to_read"]) > 0

def test_invalid_url_rejection():
    response = client.post("/api/analyze", json={"repository_url": "https://notgithub.com/bad/repo"})
    assert response.status_code == 400
