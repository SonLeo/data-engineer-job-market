"""
Unit & Integration Tests for Vietnam Data Engineer Job Market Flask Backend
"""

import pytest
import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from api import app, load_data, clean_data, parse_skills, calculate_salary_mid


@pytest.fixture
def client():
    """Create Flask test client."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


# ─────────────────────────────────────────────────────────
# Unit Tests: Data Processing Helpers
# ─────────────────────────────────────────────────────────

def test_parse_skills():
    """Test skill parsing logic."""
    skills = parse_skills("Python|SQL|AWS|Airflow|Spark")
    assert skills == ["Python", "SQL", "AWS", "Airflow", "Spark"]

    # Test trim whitespace and deduplication
    skills_with_spaces = parse_skills(" Python | SQL | python | AWS ")
    assert len(skills_with_spaces) == 3
    assert "Python" in skills_with_spaces
    assert "SQL" in skills_with_spaces
    assert "AWS" in skills_with_spaces

    # Test empty / None handling
    assert parse_skills(None) == []
    assert parse_skills("") == []


def test_calculate_salary_mid():
    """Test salary midpoint calculation."""
    import pandas as pd
    import numpy as np

    df = pd.DataFrame({
        "salary_min": [20e6, 30e6, np.nan, np.nan],
        "salary_max": [40e6, np.nan, 50e6, np.nan]
    })
    mid = calculate_salary_mid(df)

    assert mid.iloc[0] == 30e6
    assert mid.iloc[1] == 30e6
    assert mid.iloc[2] == 50e6
    assert pd.isna(mid.iloc[3])


# ─────────────────────────────────────────────────────────
# Integration Tests: Page Routes
# ─────────────────────────────────────────────────────────

def test_page_routes(client):
    """Test that all HTML page routes return 200 OK."""
    pages = ["/", "/jobs", "/salary", "/skills", "/locations", "/jobs/DE001"]
    for page in pages:
        response = client.get(page)
        assert response.status_code == 200, f"Page {page} failed with status {response.status_code}"


# ─────────────────────────────────────────────────────────
# Integration Tests: API Endpoints
# ─────────────────────────────────────────────────────────

def test_api_dashboard(client):
    """Test GET /api/dashboard with default and custom trend_range."""
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "data" in data
    d = data["data"]
    assert "total_jobs" in d
    assert "total_companies" in d
    assert "median_salary" in d
    assert "average_salary" in d
    assert "highest_salary" in d
    assert "new_jobs" in d
    assert "remote_jobs" in d
    assert "job_trend" in d
    assert d["total_jobs"] > 0

    # Test trend ranges
    for r in ["1w", "1m", "1y", "3y", "5y", "all"]:
        res_r = client.get(f"/api/dashboard?trend_range={r}")
        assert res_r.status_code == 200
        data_r = res_r.get_json()
        assert data_r["success"] is True
        assert isinstance(data_r["data"]["job_trend"], list)


def test_api_jobs_pagination(client):
    """Test GET /api/jobs with pagination."""
    response = client.get("/api/jobs?page=1&per_page=10")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "data" in data
    assert "pagination" in data
    assert len(data["data"]) <= 10
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["per_page"] == 10
    assert data["pagination"]["total"] > 0


def test_api_jobs_search_filters(client):
    """Test search with keyword and location filter."""
    # Keyword search
    res = client.get("/api/jobs?keyword=Python")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True

    # Location search
    res_loc = client.get("/api/jobs?location=Hanoi")
    assert res_loc.status_code == 200
    data_loc = res_loc.get_json()
    assert data_loc["success"] is True
    for job in data_loc["data"]:
        assert "hanoi" in job["location"].lower()

    # Remote filter
    res_remote = client.get("/api/jobs?remote=true")
    assert res_remote.status_code == 200
    data_remote = res_remote.get_json()
    for job in data_remote["data"]:
        assert job["remote"] is True


def test_api_job_detail_valid(client):
    """Test GET /api/jobs/<job_id> with a valid ID."""
    response = client.get("/api/jobs/DE001")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["job_id"] == "DE001"
    assert "title" in data["data"]
    assert "company" in data["data"]
    assert "skills" in data["data"]
    assert isinstance(data["data"]["skills"], list)


def test_api_job_detail_invalid(client):
    """Test GET /api/jobs/<job_id> with a non-existent ID returns 404."""
    response = client.get("/api/jobs/NON_EXISTING_ID_99999")
    assert response.status_code == 404
    data = response.get_json()
    assert data["success"] is False
    assert "error" in data


def test_api_salary_analytics(client):
    """Test GET /api/analytics/salary."""
    response = client.get("/api/analytics/salary")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    d = data["data"]
    assert "overview" in d
    assert "distribution" in d
    assert "by_experience" in d
    assert "by_location" in d
    assert "by_skill" in d
    assert d["overview"]["average"] > 0
    assert d["overview"]["median"] > 0


def test_api_skills_analytics(client):
    """Test GET /api/analytics/skills."""
    response = client.get("/api/analytics/skills")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    d = data["data"]
    assert "top_skills" in d
    assert "skill_combinations" in d
    assert len(d["top_skills"]) > 0
    assert "skill" in d["top_skills"][0]
    assert "percentage" in d["top_skills"][0]


def test_api_location_analytics(client):
    """Test GET /api/analytics/locations."""
    response = client.get("/api/analytics/locations")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    d = data["data"]
    assert "locations" in d
    assert len(d["locations"]) > 0
    assert "location" in d["locations"][0]
    assert "job_count" in d["locations"][0]
    assert "percentage" in d["locations"][0]


def test_api_health(client):
    """Test GET /api/health."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert "database" in data
    assert "total_jobs_loaded" in data
    assert data["total_jobs_loaded"] > 0


def test_api_reload(client):
    """Test POST /api/reload."""
    response = client.post("/api/reload")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "Successfully reloaded" in data["message"]

