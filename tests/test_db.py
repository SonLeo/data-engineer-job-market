"""
Unit & Integration Tests for IBM DB2 Database Module
"""

import pytest
import sys
from pathlib import Path

# Add project root and src to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / "src"
for p in [str(SRC_DIR), str(BASE_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from src import db
import pandas as pd


def test_get_db2_config():
    """Test retrieving DB2 configuration parameters."""
    cfg = db.get_db2_config()
    assert isinstance(cfg, dict)
    assert "database" in cfg
    assert "hostname" in cfg
    assert "port" in cfg
    assert "uid" in cfg
    assert "pwd" in cfg
    assert cfg["security"] == "SSL"
    assert len(cfg["hostname"]) > 0


def test_get_db2_dsn():
    """Test connection DSN construction."""
    dsn = db.get_db2_dsn()
    assert "DATABASE=" in dsn
    assert "HOSTNAME=" in dsn
    assert "PORT=" in dsn
    assert "UID=" in dsn
    assert "PWD=" in dsn
    assert "SECURITY=SSL;" in dsn


def test_check_connection():
    """Test checking live connection to IBM DB2 Cloud."""
    ok, info = db.check_connection()
    assert ok is True
    assert "DB2" in info or "11." in info


def test_fetch_jobs_dataframe():
    """Test fetching jobs data from DB2 into DataFrame."""
    df = db.fetch_jobs_dataframe()
    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    assert len(df) >= 200
    
    # Check essential columns exist
    expected_cols = [
        "job_id", "title", "company", "location", "salary_min", "salary_max",
        "salary_currency", "experience_min", "experience_max", "employment_type",
        "remote", "description", "skills", "source", "url", "posted_date", "scraped_at"
    ]
    for col in expected_cols:
        assert col in df.columns, f"Missing column: {col}"

    # Check sample row
    sample = df[df["job_id"] == "DE001"]
    assert not sample.empty
    assert sample.iloc[0]["company"] == "FPT Software"
