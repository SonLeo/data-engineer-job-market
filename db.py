"""
Vietnam Data Engineer Job Market — Database Module (IBM DB2)
Manages IBM DB2 Cloud connection, table initialization, CSV ingestion, and data retrieval.
"""

import os
import sys
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple, Dict, Any, List

import pandas as pd
import numpy as np

# Load environment variables
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Try importing ibm_db
try:
    import ibm_db
    import ibm_db_dbi
    HAS_IBM_DB = True
except ImportError:
    ibm_db = None
    ibm_db_dbi = None
    HAS_IBM_DB = False
    logger.warning("ibm_db module is not installed. Running in mock/fallback mode.")


def get_db2_config() -> Dict[str, Any]:
    """
    Retrieve DB2 configuration from environment variables,
    falling back to data.json if environment variables are not set.
    """
    database = os.getenv("DB2_DATABASE")
    hostname = os.getenv("DB2_HOSTNAME")
    port = os.getenv("DB2_PORT")
    protocol = os.getenv("DB2_PROTOCOL", "TCPIP")
    uid = os.getenv("DB2_UID")
    pwd = os.getenv("DB2_PWD")
    security = os.getenv("DB2_SECURITY", "SSL")

    if not all([database, hostname, port, uid, pwd]):
        # Fallback to data.json
        data_json_path = BASE_DIR / "data.json"
        if data_json_path.exists():
            try:
                with open(data_json_path, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                    if isinstance(raw, str):
                        raw = json.loads(raw)
                    db2_info = raw.get("connection", {}).get("db2", {})
                    database = db2_info.get("database", database or "bludb")
                    auth = db2_info.get("authentication", {})
                    uid = auth.get("username", uid)
                    pwd = auth.get("password", pwd)
                    hosts = db2_info.get("hosts", [{}])
                    if hosts:
                        hostname = hosts[0].get("hostname", hostname)
                        port = str(hosts[0].get("port", port))
            except Exception as e:
                logger.error(f"Failed to parse fallback data.json: {e}")

    return {
        "database": database,
        "hostname": hostname,
        "port": port,
        "protocol": protocol,
        "uid": uid,
        "pwd": pwd,
        "security": security
    }


def get_db2_dsn() -> str:
    """Build connection DSN string for IBM DB2."""
    cfg = get_db2_config()
    return (
        f"DATABASE={cfg['database']};"
        f"HOSTNAME={cfg['hostname']};"
        f"PORT={cfg['port']};"
        f"PROTOCOL={cfg['protocol']};"
        f"UID={cfg['uid']};"
        f"PWD={cfg['pwd']};"
        f"SECURITY={cfg['security']};"
    )


def get_db_connection():
    """
    Establish and return a live connection to IBM DB2.
    Raises ConnectionError if connection cannot be established.
    """
    if not HAS_IBM_DB:
        raise ConnectionError("ibm_db package is not installed.")

    dsn = get_db2_dsn()
    try:
        conn = ibm_db.connect(dsn, "", "")
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to IBM DB2: {e}")
        raise ConnectionError(f"IBM DB2 connection error: {e}")


def check_connection() -> Tuple[bool, str]:
    """Check if IBM DB2 connection is active and responsive."""
    if not HAS_IBM_DB:
        return False, "ibm_db driver is not installed"
    try:
        conn = get_db_connection()
        server = ibm_db.server_info(conn)
        info = f"{server.DBMS_NAME} {server.DBMS_VER}"
        ibm_db.close(conn)
        return True, info
    except Exception as e:
        return False, str(e)


def init_db(drop_existing: bool = False) -> bool:
    """
    Initialize IBM DB2 database tables from sql/create_tables.sql.
    """
    sql_path = BASE_DIR / "sql" / "create_tables.sql"
    if not sql_path.exists():
        logger.error(f"DDL file not found at {sql_path}")
        return False

    conn = get_db_connection()
    try:
        if drop_existing:
            logger.info("Dropping existing jobs table if exists...")
            try:
                ibm_db.exec_immediate(conn, "DROP TABLE jobs")
                logger.info("Dropped existing jobs table.")
            except Exception:
                pass  # Ignore if table didn't exist

        # Check if table already exists
        check_sql = "SELECT 1 FROM syscat.tables WHERE tabname = 'JOBS' AND tabschema = CURRENT SCHEMA"
        stmt = ibm_db.exec_immediate(conn, check_sql)
        row = ibm_db.fetch_row(stmt)
        if row and not drop_existing:
            logger.info("Table JOBS already exists. Skipping creation.")
            return True

        # Execute table creation
        with open(sql_path, "r", encoding="utf-8") as f:
            sql_content = f.read()

        statements = [stmt.strip() for stmt in sql_content.split(";") if stmt.strip()]
        for stmt_sql in statements:
            # Clean up comments and execute
            lines = [l for l in stmt_sql.split("\n") if not l.strip().startswith("--")]
            clean_stmt = "\n".join(lines).strip()
            if clean_stmt:
                try:
                    ibm_db.exec_immediate(conn, clean_stmt)
                    logger.info(f"Executed: {clean_stmt[:50]}...")
                except Exception as e:
                    # Index might already exist or similar
                    logger.warning(f"Notice on statement execution: {e}")

        logger.info("Database initialization completed successfully.")
        return True
    finally:
        ibm_db.close(conn)


def import_csv_to_db(csv_path: Optional[str] = None, truncate_first: bool = True, batch_size: int = 200) -> int:
    """
    Read data from CSV and insert into IBM DB2 jobs table using high-speed multi-row batches.
    Returns the count of records processed.
    """
    if csv_path is None:
        csv_path = BASE_DIR / "data" / "jobs.csv"
    else:
        csv_path = Path(csv_path)

    if not csv_path.exists():
        logger.error(f"CSV file not found at {csv_path}")
        return 0

    df = pd.read_csv(csv_path, dtype={"job_id": str})
    if df.empty:
        logger.warning("CSV file is empty.")
        return 0

    logger.info(f"Loaded {len(df)} records from {csv_path}. Preparing insertion into IBM DB2...")

    # Ensure table exists
    init_db(drop_existing=False)

    conn = get_db_connection()
    try:
        # Turn off autocommit for transactional performance
        try:
            ibm_db.autocommit(conn, ibm_db.SQL_AUTOCOMMIT_OFF)
        except Exception as e:
            logger.warning(f"Could not disable autocommit: {e}")

        if truncate_first:
            logger.info("Clearing existing records from jobs table...")
            try:
                ibm_db.exec_immediate(conn, "DELETE FROM jobs")
                ibm_db.commit(conn)
                logger.info("Cleared existing records.")
            except Exception as e:
                logger.warning(f"Notice on deleting existing rows: {e}")

        # Parse rows
        rows_to_insert = []
        for _, row in df.iterrows():
            job_id = str(row.get("job_id", "")).strip()
            if not job_id:
                continue

            title = str(row.get("title", "")).strip() or "N/A"
            company = str(row.get("company", "")).strip() or "N/A"
            location = str(row.get("location", "")).strip() if pd.notna(row.get("location")) else None

            # Numeric salaries
            salary_min = float(row["salary_min"]) if pd.notna(row.get("salary_min")) and float(row["salary_min"]) > 0 else None
            salary_max = float(row["salary_max"]) if pd.notna(row.get("salary_max")) and float(row["salary_max"]) > 0 else None
            salary_currency = str(row.get("salary_currency", "VND")).strip() if pd.notna(row.get("salary_currency")) else "VND"

            # Numeric experience
            exp_min = float(row["experience_min"]) if pd.notna(row.get("experience_min")) and float(row["experience_min"]) >= 0 else None
            exp_max = float(row["experience_max"]) if pd.notna(row.get("experience_max")) and float(row["experience_max"]) >= 0 else None

            employment_type = str(row.get("employment_type", "Full-time")).strip() if pd.notna(row.get("employment_type")) else "Full-time"
            
            # Remote bool -> smallint
            raw_remote = str(row.get("remote", "")).lower()
            remote_val = 1 if raw_remote in ["true", "1", "yes", "remote"] else 0

            description = str(row.get("description", "")).strip() if pd.notna(row.get("description")) else None
            skills = str(row.get("skills", "")).strip() if pd.notna(row.get("skills")) else None
            source = str(row.get("source", "")).strip() if pd.notna(row.get("source")) else None
            url = str(row.get("url", "")).strip() if pd.notna(row.get("url")) else None

            # Date formats: YYYY-MM-DD
            def parse_date_str(val):
                if pd.isna(val) or not val:
                    return None
                try:
                    return pd.to_datetime(val).strftime("%Y-%m-%d")
                except Exception:
                    return None

            posted_date = parse_date_str(row.get("posted_date"))
            scraped_at = parse_date_str(row.get("scraped_at"))

            rows_to_insert.append((
                job_id, title, company, location, salary_min, salary_max,
                salary_currency, exp_min, exp_max, employment_type,
                remote_val, description, skills, source, url,
                posted_date, scraped_at
            ))

        total_rows = len(rows_to_insert)
        logger.info(f"Inserting {total_rows} records in batches of {batch_size}...")

        inserted_count = 0
        cols_count = 17
        row_placeholder = f"({', '.join(['?'] * cols_count)})"

        for idx in range(0, total_rows, batch_size):
            chunk = rows_to_insert[idx : idx + batch_size]
            current_batch_size = len(chunk)

            # Build multi-row INSERT statement
            placeholders = ", ".join([row_placeholder] * current_batch_size)
            batch_sql = f"""
                INSERT INTO jobs (
                    job_id, title, company, location, salary_min, salary_max, salary_currency,
                    experience_min, experience_max, employment_type, remote, description,
                    skills, source, url, posted_date, scraped_at
                ) VALUES {placeholders}
            """
            flat_params = [val for item in chunk for val in item]
            
            try:
                stmt = ibm_db.prepare(conn, batch_sql)
                ibm_db.execute(stmt, tuple(flat_params))
                ibm_db.commit(conn)
                inserted_count += current_batch_size
                if inserted_count % 1000 == 0 or inserted_count == total_rows:
                    logger.info(f"Progress: {inserted_count}/{total_rows} records inserted into IBM DB2 ({inserted_count*100//total_rows}%).")
            except Exception as e:
                logger.error(f"Failed inserting batch starting at index {idx}: {e}")
                # Fallback to single inserts for this batch
                single_sql = f"INSERT INTO jobs (job_id, title, company, location, salary_min, salary_max, salary_currency, experience_min, experience_max, employment_type, remote, description, skills, source, url, posted_date, scraped_at) VALUES {row_placeholder}"
                single_stmt = ibm_db.prepare(conn, single_sql)
                for single_item in chunk:
                    try:
                        ibm_db.execute(single_stmt, single_item)
                        inserted_count += 1
                    except Exception as ex:
                        logger.warning(f"Single insert failed for {single_item[0]}: {ex}")
                ibm_db.commit(conn)

        logger.info(f"Batch ingestion completed: {inserted_count}/{total_rows} records inserted.")
        return inserted_count
    finally:
        try:
            ibm_db.autocommit(conn, ibm_db.SQL_AUTOCOMMIT_ON)
        except Exception:
            pass
        ibm_db.close(conn)


def fetch_jobs_dataframe() -> pd.DataFrame:
    """
    Fetch all job listings from IBM DB2 into a clean pandas DataFrame.
    """
    if not HAS_IBM_DB:
        logger.warning("ibm_db not available, cannot fetch from DB2.")
        return pd.DataFrame()

    conn = get_db_connection()
    try:
        query = "SELECT * FROM jobs ORDER BY posted_date DESC, job_id ASC"
        stmt = ibm_db.exec_immediate(conn, query)
        
        rows = []
        row = ibm_db.fetch_assoc(stmt)
        while row:
            # DB2 keys are returned in uppercase
            rows.append({
                "job_id": row.get("JOB_ID"),
                "title": row.get("TITLE"),
                "company": row.get("COMPANY"),
                "location": row.get("LOCATION"),
                "salary_min": float(row["SALARY_MIN"]) if row.get("SALARY_MIN") is not None else np.nan,
                "salary_max": float(row["SALARY_MAX"]) if row.get("SALARY_MAX") is not None else np.nan,
                "salary_currency": row.get("SALARY_CURRENCY") or "VND",
                "experience_min": float(row["EXPERIENCE_MIN"]) if row.get("EXPERIENCE_MIN") is not None else np.nan,
                "experience_max": float(row["EXPERIENCE_MAX"]) if row.get("EXPERIENCE_MAX") is not None else np.nan,
                "employment_type": row.get("EMPLOYMENT_TYPE") or "Full-time",
                "remote": bool(int(row["REMOTE"])) if row.get("REMOTE") is not None else False,
                "description": row.get("DESCRIPTION"),
                "skills": row.get("SKILLS"),
                "source": row.get("SOURCE"),
                "url": row.get("URL"),
                "posted_date": str(row.get("POSTED_DATE")) if row.get("POSTED_DATE") else None,
                "scraped_at": str(row.get("SCRAPED_AT")) if row.get("SCRAPED_AT") else None,
            })
            row = ibm_db.fetch_assoc(stmt)

        df = pd.DataFrame(rows)
        logger.info(f"Fetched {len(df)} jobs from IBM DB2 database.")
        return df
    finally:
        ibm_db.close(conn)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Manage IBM DB2 for Vietnam Data Engineer Job Market")
    parser.add_argument("--init", action="store_true", help="Initialize tables from sql/create_tables.sql")
    parser.add_argument("--drop", action="store_true", help="Drop existing tables before init")
    parser.add_argument("--import-csv", dest="import_csv", nargs="?", const="data/jobs.csv", help="Import CSV data into DB2")
    parser.add_argument("--verify", action="store_true", help="Verify DB connection and record count")
    parser.add_argument("--all", action="store_true", help="Run init, import CSV, and verify in sequence")

    args = parser.parse_args()

    if len(sys.argv) == 1 or args.all:
        print("=== Step 1: Checking DB2 Connection ===")
        ok, msg = check_connection()
        print(f"Status: {'CONNECTED' if ok else 'FAILED'} -> {msg}")
        if not ok:
            sys.exit(1)

        print("\n=== Step 2: Initializing DB2 Tables ===")
        init_db(drop_existing=args.drop)

        print("\n=== Step 3: Importing data/jobs.csv to DB2 ===")
        count = import_csv_to_db()
        print(f"Ingested {count} records.")

        print("\n=== Step 4: Verifying Data Retrieval ===")
        df = fetch_jobs_dataframe()
        print(f"Total jobs retrieved: {len(df)}")
        if not df.empty:
            print(df[["job_id", "title", "company", "location", "salary_min", "salary_max"]].head(5))

    else:
        if args.verify:
            ok, msg = check_connection()
            print(f"Connection: {'OK' if ok else 'FAILED'} ({msg})")
            if ok:
                df = fetch_jobs_dataframe()
                print(f"Total records in DB2: {len(df)}")
        if args.init:
            init_db(drop_existing=args.drop)
        if args.import_csv:
            import_csv_to_db(args.import_csv)
