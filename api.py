"""
Vietnam Data Engineer Job Market — Phase 1 Backend
Flask API with Pandas data processing
"""

from pathlib import Path
from datetime import datetime, timedelta

import pandas as pd
import numpy as np
from flask import Flask, jsonify, request, render_template

# ─────────────────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────────────────

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "jobs.csv"

# ─────────────────────────────────────────────────────────
# Data Loading & Cleaning
# ─────────────────────────────────────────────────────────

def load_data():
    """Load CSV data with Pandas."""
    if not DATA_PATH.exists():
        return pd.DataFrame()
    try:
        df = pd.read_csv(DATA_PATH, dtype={"job_id": str})
        return df
    except Exception as e:
        print(f"[ERROR] Failed to load data: {e}")
        return pd.DataFrame()


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize the raw dataframe."""
    if df.empty:
        return df

    # Drop duplicates by job_id
    df = df.drop_duplicates(subset=["job_id"], keep="first")

    # Strip string fields
    str_cols = ["title", "company", "location", "description",
                "skills", "source", "url", "employment_type",
                "salary_currency"]
    for col in str_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace({"nan": None, "": None})

    # Numeric: salary
    for col in ["salary_min", "salary_max"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
            # Treat 0 as missing
            df[col] = df[col].where(df[col] > 0, other=np.nan)

    # Numeric: experience
    for col in ["experience_min", "experience_max"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
            df[col] = df[col].where(df[col] >= 0, other=np.nan)

    # Salary midpoint
    df["salary_mid"] = calculate_salary_mid(df)

    # Experience midpoint
    df["experience_mid"] = calculate_experience_mid(df)

    # Remote flag — normalize to bool
    if "remote" in df.columns:
        df["remote"] = df["remote"].astype(str).str.lower().isin(
            ["true", "1", "yes", "remote"]
        )

    # Parse dates
    for col in ["posted_date", "scraped_at"]:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")

    # Skills list
    df["skills_list"] = df["skills"].apply(parse_skills)

    return df


def calculate_salary_mid(df: pd.DataFrame) -> pd.Series:
    """Calculate salary midpoint safely."""
    has_min = df["salary_min"].notna() if "salary_min" in df.columns else pd.Series(False, index=df.index)
    has_max = df["salary_max"].notna() if "salary_max" in df.columns else pd.Series(False, index=df.index)

    salary_min = df.get("salary_min", pd.Series(np.nan, index=df.index))
    salary_max = df.get("salary_max", pd.Series(np.nan, index=df.index))

    mid = pd.Series(np.nan, index=df.index)
    mid = mid.where(~(has_min & has_max), (salary_min + salary_max) / 2)
    mid = mid.where(~(has_min & ~has_max), salary_min)
    mid = mid.where(~(~has_min & has_max), salary_max)
    return mid


def calculate_experience_mid(df: pd.DataFrame) -> pd.Series:
    """Calculate experience midpoint safely."""
    has_min = df["experience_min"].notna() if "experience_min" in df.columns else pd.Series(False, index=df.index)
    has_max = df["experience_max"].notna() if "experience_max" in df.columns else pd.Series(False, index=df.index)

    exp_min = df.get("experience_min", pd.Series(np.nan, index=df.index))
    exp_max = df.get("experience_max", pd.Series(np.nan, index=df.index))

    mid = pd.Series(np.nan, index=df.index)
    mid = mid.where(~(has_min & has_max), (exp_min + exp_max) / 2)
    return mid


def parse_skills(skills_str) -> list:
    """Parse pipe-separated skills string into a cleaned list."""
    if not skills_str or pd.isna(skills_str):
        return []
    parts = str(skills_str).split("|")
    seen = set()
    result = []
    for s in parts:
        s = s.strip()
        if s and s.lower() not in seen:
            seen.add(s.lower())
            result.append(s)
    return result


def safe_value(val, default=None):
    """Convert NaN / None to a safe JSON-serializable value."""
    if val is None:
        return default
    if isinstance(val, float) and np.isnan(val):
        return default
    if isinstance(val, (np.integer,)):
        return int(val)
    if isinstance(val, (np.floating,)):
        return round(float(val), 2)
    return val


def format_date(dt) -> str:
    """Format pandas Timestamp to readable string."""
    if pd.isna(dt):
        return None
    try:
        return dt.strftime("%d %b %Y")
    except Exception:
        return None


# ─────────────────────────────────────────────────────────
# Load data at startup
# ─────────────────────────────────────────────────────────

_raw_df = load_data()
DF = clean_data(_raw_df)


def get_df() -> pd.DataFrame:
    """Return the cleaned dataframe."""
    return DF


# ─────────────────────────────────────────────────────────
# Page Routes
# ─────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/jobs")
def jobs_page():
    return render_template("jobs.html")


@app.route("/jobs/<job_id>")
def job_detail_page(job_id):
    return render_template("job-detail.html", job_id=job_id)


@app.route("/salary")
def salary_page():
    return render_template("salary.html")


@app.route("/skills")
def skills_page():
    return render_template("skills.html")


@app.route("/locations")
def locations_page():
    return render_template("locations.html")


# ─────────────────────────────────────────────────────────
# API: Dashboard
# ─────────────────────────────────────────────────────────

@app.route("/api/dashboard")
def api_dashboard():
    try:
        df = get_df()

        if df.empty:
            return jsonify({"success": True, "data": {
                "total_jobs": 0, "total_companies": 0,
                "median_salary": None, "average_salary": None,
                "highest_salary": None, "new_jobs": 0, "remote_jobs": 0
            }})

        salary_series = df["salary_mid"].dropna()
        salary_series = salary_series[salary_series > 0]

        total_jobs = int(len(df))
        total_companies = int(df["company"].dropna().nunique())
        median_salary = safe_value(salary_series.median())
        average_salary = safe_value(salary_series.mean())
        highest_salary = safe_value(salary_series.max())
        remote_jobs = int(df["remote"].sum()) if "remote" in df.columns else 0

        # Jobs posted in the last 7 days
        new_jobs = 0
        if "posted_date" in df.columns:
            cutoff = pd.Timestamp.now() - pd.Timedelta(days=30)
            new_jobs = int(df["posted_date"].dropna().gt(cutoff).sum())

        # Job trend: last 30 days by date
        trend = []
        if "posted_date" in df.columns:
            df_trend = df.dropna(subset=["posted_date"]).copy()
            df_trend["date_str"] = df_trend["posted_date"].dt.strftime("%Y-%m-%d")
            trend_series = df_trend.groupby("date_str").size().reset_index(name="count")
            trend_series = trend_series.sort_values("date_str")
            trend = trend_series.to_dict(orient="records")

        return jsonify({
            "success": True,
            "data": {
                "total_jobs": total_jobs,
                "total_companies": total_companies,
                "median_salary": median_salary,
                "average_salary": average_salary,
                "highest_salary": highest_salary,
                "new_jobs": new_jobs,
                "remote_jobs": remote_jobs,
                "job_trend": trend
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────────────────
# API: Job Search
# ─────────────────────────────────────────────────────────

@app.route("/api/jobs")
def api_jobs():
    try:
        df = get_df().copy()

        if df.empty:
            return jsonify({
                "success": True,
                "data": [],
                "pagination": {"page": 1, "per_page": 20, "total": 0, "total_pages": 0}
            })

        # ── Filters ──
        keyword = request.args.get("keyword", "").strip().lower()
        location = request.args.get("location", "").strip().lower()
        experience = request.args.get("experience", "").strip().lower()
        salary_min_param = request.args.get("salary_min", "").strip()
        salary_max_param = request.args.get("salary_max", "").strip()
        remote_param = request.args.get("remote", "").strip().lower()

        # Keyword search in title, company, description, skills
        if keyword:
            mask = (
                df["title"].fillna("").str.lower().str.contains(keyword, na=False) |
                df["company"].fillna("").str.lower().str.contains(keyword, na=False) |
                df["description"].fillna("").str.lower().str.contains(keyword, na=False) |
                df["skills"].fillna("").str.lower().str.contains(keyword, na=False)
            )
            df = df[mask]

        # Location filter
        if location:
            df = df[df["location"].fillna("").str.lower().str.contains(location, na=False)]

        # Experience filter (junior/mid/senior buckets)
        if experience == "junior":
            df = df[df["experience_mid"].fillna(99) <= 2]
        elif experience == "mid":
            df = df[(df["experience_mid"].fillna(-1) > 2) & (df["experience_mid"].fillna(-1) <= 5)]
        elif experience == "senior":
            df = df[df["experience_mid"].fillna(-1) > 5]

        # Salary filters
        if salary_min_param:
            try:
                s_min = float(salary_min_param)
                df = df[df["salary_mid"].fillna(0) >= s_min]
            except ValueError:
                pass

        if salary_max_param:
            try:
                s_max = float(salary_max_param)
                df = df[df["salary_mid"].fillna(float("inf")) <= s_max]
            except ValueError:
                pass

        # Remote filter
        if remote_param in ("true", "1", "yes"):
            df = df[df["remote"] == True]
        elif remote_param in ("false", "0", "no"):
            df = df[df["remote"] == False]

        # ── Pagination ──
        total = len(df)
        try:
            page = max(1, int(request.args.get("page", 1)))
        except ValueError:
            page = 1
        try:
            per_page = max(1, min(100, int(request.args.get("per_page", 20))))
        except ValueError:
            per_page = 20

        total_pages = max(1, (total + per_page - 1) // per_page)
        page = min(page, total_pages)
        start = (page - 1) * per_page
        end = start + per_page
        page_df = df.iloc[start:end]

        # ── Serialize ──
        jobs = []
        for _, row in page_df.iterrows():
            jobs.append({
                "job_id": str(row.get("job_id", "")),
                "title": safe_value(row.get("title"), "N/A"),
                "company": safe_value(row.get("company"), "N/A"),
                "location": safe_value(row.get("location"), "N/A"),
                "salary_min": safe_value(row.get("salary_min")),
                "salary_max": safe_value(row.get("salary_max")),
                "salary_mid": safe_value(row.get("salary_mid")),
                "salary_currency": safe_value(row.get("salary_currency"), "VND"),
                "experience_min": safe_value(row.get("experience_min")),
                "experience_max": safe_value(row.get("experience_max")),
                "employment_type": safe_value(row.get("employment_type"), "N/A"),
                "remote": bool(row.get("remote", False)),
                "skills": row.get("skills_list", []),
                "posted_date": format_date(row.get("posted_date")),
                "source": safe_value(row.get("source"), "N/A"),
            })

        return jsonify({
            "success": True,
            "data": jobs,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": total_pages
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────────────────
# API: Job Detail
# ─────────────────────────────────────────────────────────

@app.route("/api/jobs/<job_id>")
def api_job_detail(job_id):
    try:
        df = get_df()

        if df.empty:
            return jsonify({"success": False, "error": "Job not found"}), 404

        matches = df[df["job_id"].astype(str) == str(job_id)]

        if matches.empty:
            return jsonify({"success": False, "error": "Job not found"}), 404

        row = matches.iloc[0]

        # Validate URL
        url = safe_value(row.get("url"))
        if url and not str(url).startswith("http"):
            url = None

        job = {
            "job_id": str(row.get("job_id", "")),
            "title": safe_value(row.get("title"), "N/A"),
            "company": safe_value(row.get("company"), "N/A"),
            "location": safe_value(row.get("location"), "N/A"),
            "salary_min": safe_value(row.get("salary_min")),
            "salary_max": safe_value(row.get("salary_max")),
            "salary_mid": safe_value(row.get("salary_mid")),
            "salary_currency": safe_value(row.get("salary_currency"), "VND"),
            "experience_min": safe_value(row.get("experience_min")),
            "experience_max": safe_value(row.get("experience_max")),
            "employment_type": safe_value(row.get("employment_type"), "N/A"),
            "remote": bool(row.get("remote", False)),
            "description": safe_value(row.get("description"), "No description available."),
            "skills": row.get("skills_list", []),
            "source": safe_value(row.get("source"), "N/A"),
            "url": url,
            "posted_date": format_date(row.get("posted_date")),
            "scraped_at": format_date(row.get("scraped_at")),
        }

        return jsonify({"success": True, "data": job})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────────────────
# API: Salary Analytics
# ─────────────────────────────────────────────────────────

@app.route("/api/analytics/salary")
def api_salary_analytics():
    try:
        df = get_df()

        if df.empty:
            return jsonify({"success": True, "data": {
                "overview": {}, "distribution": [],
                "by_experience": [], "by_location": [], "by_skill": []
            }})

        # Only jobs with valid salary
        df_sal = df[df["salary_mid"].notna() & (df["salary_mid"] > 0)].copy()

        # Overview
        overview = {}
        if not df_sal.empty:
            overview = {
                "average": safe_value(df_sal["salary_mid"].mean()),
                "median": safe_value(df_sal["salary_mid"].median()),
                "minimum": safe_value(df_sal["salary_mid"].min()),
                "maximum": safe_value(df_sal["salary_mid"].max()),
                "count": int(len(df_sal))
            }

        # Distribution: salary buckets (in millions VND)
        distribution = []
        if not df_sal.empty:
            bins = [0, 15e6, 25e6, 35e6, 50e6, 70e6, 100e6, float("inf")]
            labels = ["<15M", "15-25M", "25-35M", "35-50M", "50-70M", "70-100M", ">100M"]
            df_sal["salary_bucket"] = pd.cut(
                df_sal["salary_mid"], bins=bins, labels=labels, right=True
            )
            bucket_counts = df_sal["salary_bucket"].value_counts().reindex(labels, fill_value=0)
            for label, count in bucket_counts.items():
                distribution.append({"range": label, "count": int(count)})

        # By experience level
        by_experience = []
        if not df_sal.empty and "experience_mid" in df_sal.columns:
            def exp_label(v):
                if pd.isna(v): return None
                if v <= 1: return "Entry (0-1y)"
                if v <= 2: return "Junior (1-2y)"
                if v <= 4: return "Mid (2-4y)"
                if v <= 7: return "Senior (4-7y)"
                return "Principal (7y+)"

            df_sal["exp_label"] = df_sal["experience_mid"].apply(exp_label)
            df_exp = df_sal.dropna(subset=["exp_label"])
            order = ["Entry (0-1y)", "Junior (1-2y)", "Mid (2-4y)", "Senior (4-7y)", "Principal (7y+)"]
            exp_stats = df_exp.groupby("exp_label")["salary_mid"].agg(
                average="mean", median="median", count="count"
            ).reindex(order).dropna()
            for exp, row in exp_stats.iterrows():
                by_experience.append({
                    "experience": exp,
                    "average_salary": safe_value(row["average"]),
                    "median_salary": safe_value(row["median"]),
                    "count": int(row["count"])
                })

        # By location
        by_location = []
        if not df_sal.empty and "location" in df_sal.columns:
            loc_stats = df_sal.groupby("location")["salary_mid"].agg(
                average="mean", median="median", count="count"
            ).sort_values("average", ascending=False).head(10)
            for loc, row in loc_stats.iterrows():
                by_location.append({
                    "location": loc,
                    "average_salary": safe_value(row["average"]),
                    "median_salary": safe_value(row["median"]),
                    "count": int(row["count"])
                })

        # By skill (top 15 skills by average salary)
        by_skill = []
        if not df_sal.empty:
            skill_rows = []
            for _, row in df_sal.iterrows():
                for skill in row.get("skills_list", []):
                    skill_rows.append({"skill": skill, "salary": row["salary_mid"]})
            if skill_rows:
                df_skills_sal = pd.DataFrame(skill_rows)
                skill_stats = df_skills_sal.groupby("skill")["salary"].agg(
                    average="mean", median="median", count="count"
                ).sort_values("average", ascending=False).head(15)
                for skill, row in skill_stats.iterrows():
                    by_skill.append({
                        "skill": skill,
                        "average_salary": safe_value(row["average"]),
                        "median_salary": safe_value(row["median"]),
                        "count": int(row["count"])
                    })

        return jsonify({
            "success": True,
            "data": {
                "overview": overview,
                "distribution": distribution,
                "by_experience": by_experience,
                "by_location": by_location,
                "by_skill": by_skill
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────────────────
# API: Skills Analytics
# ─────────────────────────────────────────────────────────

@app.route("/api/analytics/skills")
def api_skills_analytics():
    try:
        df = get_df()

        if df.empty:
            return jsonify({"success": True, "data": {
                "top_skills": [], "skill_combinations": []
            }})

        total_jobs = len(df)

        # Flatten all skills
        all_skills = []
        for skills in df["skills_list"]:
            all_skills.extend(skills)

        from collections import Counter
        skill_counts = Counter(all_skills)

        top_skills = []
        for skill, count in skill_counts.most_common(20):
            top_skills.append({
                "skill": skill,
                "count": count,
                "percentage": round(count / total_jobs * 100, 1)
            })

        # Skill combinations (top pairs)
        from itertools import combinations
        combo_counts = Counter()
        for skills in df["skills_list"]:
            if len(skills) >= 2:
                for combo in combinations(sorted(skills[:8]), 2):
                    combo_counts[combo] += 1

        skill_combinations = []
        for (s1, s2), count in combo_counts.most_common(15):
            skill_combinations.append({
                "skill1": s1,
                "skill2": s2,
                "combination": f"{s1} + {s2}",
                "count": count,
                "percentage": round(count / total_jobs * 100, 1)
            })

        return jsonify({
            "success": True,
            "data": {
                "top_skills": top_skills,
                "skill_combinations": skill_combinations
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────────────────
# API: Location Analytics
# ─────────────────────────────────────────────────────────

@app.route("/api/analytics/locations")
def api_location_analytics():
    try:
        df = get_df()

        if df.empty:
            return jsonify({"success": True, "data": {"locations": []}})

        total_jobs = len(df)
        df_sal = df[df["salary_mid"].notna() & (df["salary_mid"] > 0)]

        loc_counts = df.groupby("location").size().reset_index(name="job_count")
        loc_salary = df_sal.groupby("location")["salary_mid"].agg(
            average_salary="mean",
            median_salary="median"
        ).reset_index()

        loc_df = loc_counts.merge(loc_salary, on="location", how="left")
        loc_df = loc_df.sort_values("job_count", ascending=False)

        locations = []
        for _, row in loc_df.iterrows():
            locations.append({
                "location": row["location"],
                "job_count": int(row["job_count"]),
                "percentage": round(row["job_count"] / total_jobs * 100, 1),
                "average_salary": safe_value(row.get("average_salary")),
                "median_salary": safe_value(row.get("median_salary")),
            })

        return jsonify({
            "success": True,
            "data": {"locations": locations}
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─────────────────────────────────────────────────────────
# Error Handlers
# ─────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error"}), 500


# ─────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True)
