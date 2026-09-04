"""
Data Generator for Vietnam Data Engineer Job Market
Generates 10,000 realistic, well-distributed job listings for testing, filtering, and analytics.
"""

import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_FILE = BASE_DIR / "data" / "jobs.csv"

# Seed for reproducible realistic data
random.seed(42)
np.random.seed(42)

NUM_RECORDS = 10000

COMPANIES = [
    # Top Tech & Ecommerce
    "Shopee", "Lazada Vietnam", "Tiki", "Sendo", "VNG Corporation", "Zalo", "Grab Vietnam", 
    "Gojek Vietnam", "MoMo", "VNPay", "ZaloPay", "One Mount Group", "Base.vn", "Chotot", 
    "Sky Mavis", "Ahamove", "Be Group", "Giao Hang Tiet Kiem", "Giao Hang Nhanh", "Klook Vietnam",
    # IT Software & Outsourcing & Foreign Hubs
    "FPT Software", "KMS Technology", "NashTech", "SmartOSC", "TMA Solutions", "Axon Vietnam", 
    "Kyanon Digital", "NAB Innovation Centre Vietnam", "Katalon", "ELCA Vietnam", "DEK Technologies", 
    "Bosch Vietnam", "Renesas Design Vietnam", "Qualcomm Vietnam", "Samsung R&D Vietnam", 
    "LG Electronics Vietnam", "Orient Software", "Saigon Technology", "DXC Technology", "Capgemini", 
    "Line Vietnam", "Naver Vietnam", "Rakuten Vietnam", "Hybrid Technologies", "Sun* Inc", 
    "Rikkeisoft", "VTI Corporation", "BAP Software", "Luvina Software", "Enouvo IT Solutions",
    "DEHA Software", "NTT DATA Vietnam", "Suntech Vietnam", "Hitachi Vantara Vietnam", 
    "Siemens Vietnam", "LogiGear Vietnam", "Speranza IT", "KMS Healthcare", "Cốc Cốc",
    # Banking & Financial Services
    "Techcombank", "VPBank", "MB Bank", "Vietcombank", "TPBank", "Sacombank", "MSB", "ACB", 
    "BIDV", "VietinBank", "Home Credit Vietnam", "FE Credit", "Shinhan Bank Vietnam", 
    "Standard Chartered Vietnam", "HSBC Vietnam", "Mirae Asset Finance", "SSI Securities", 
    "VNDIRECT", "VPS Securities", "TCBS", "Masan Group", "HD Bank", "SeABank", "VIB Bank", 
    "SHB", "OCB", "KienlongBank", "BaoViet Holdings", "Prudential Vietnam", "Manulife Vietnam",
    # Telecom & Enterprise
    "Viettel Solutions", "Viettel Telecom", "VNPT Technology", "VNPT IT", "MobiFone IT", 
    "VinAI", "VinFast", "Vingroup", "VinBigData", "Sovico Group", "Hoa Phat Group", 
    "Vinamilk", "TH True Milk", "PNJ", "Mobile World Group", "FPT Retail", "Dien May Xanh", 
    "Central Retail Vietnam", "CJ CGV Vietnam", "Novaland", "Vinhomes", "KIDO Group",
    "Bitis Vietnam", "Acecook Vietnam", "Suntory PepsiCo Vietnam", "Heineken Vietnam"
]

LOCATIONS = [
    ("Ho Chi Minh City", 0.53),
    ("Hanoi", 0.37),
    ("Da Nang", 0.07),
    ("Can Tho", 0.015),
    ("Hai Phong", 0.015),
]

SOURCES = [
    ("TopDev", 0.35, "https://topdev.vn/job/"),
    ("ITviec", 0.30, "https://itviec.com/job/"),
    ("LinkedIn", 0.25, "https://linkedin.com/jobs/"),
    ("VietnamWorks", 0.10, "https://vietnamworks.com/job/"),
]

ROLE_CONFIGS = [
    {
        "title": "Junior Data Engineer",
        "weight": 0.18,
        "exp_range": (0, 2),
        "salary_range": (12_000_000, 26_000_000),
        "primary_skills": ["Python", "SQL", "ETL", "Pandas", "Git", "PostgreSQL", "MySQL"],
        "optional_skills": ["Spark", "Airflow", "Docker", "AWS", "Linux", "dbt"],
        "descriptions": [
            "Participate in building and optimizing basic data ingestion pipelines. Work closely with senior engineers to transform raw operational datasets into analytical tables.",
            "Assist data engineering team in ETL pipeline development, database maintenance, data quality monitoring, and writing SQL transformations.",
            "Develop, test and support data integration workflows using Python and SQL. Great opportunity to learn big data technologies and cloud infrastructure.",
            "Entry-level Data Engineer responsible for data cleaning, basic data pipeline maintenance, schema migrations, and assisting BI team."
        ]
    },
    {
        "title": "Data Engineer",
        "weight": 0.42,
        "exp_range": (2, 5),
        "salary_range": (26_000_000, 52_000_000),
        "primary_skills": ["Python", "SQL", "Spark", "Airflow", "AWS", "PostgreSQL", "dbt", "Docker"],
        "optional_skills": ["Kafka", "GCP", "Azure", "Snowflake", "BigQuery", "Redshift", "Databricks", "Kubernetes", "Hadoop", "Hive"],
        "descriptions": [
            "Design, implement and maintain end-to-end scalable data pipelines and modern data warehouse solutions supporting high-volume business operations.",
            "Build robust batch and stream processing pipelines using Spark, Airflow, and Cloud data services. Collaborate with data scientists and analysts to provide clean datasets.",
            "Manage enterprise ETL/ELT pipelines, dimensional data modeling (Kimball), data quality automation, and performance tuning on cloud databases.",
            "Responsible for building and operating real-time and batch data infrastructure, ensuring low latency, data integrity, and high reliability."
        ]
    },
    {
        "title": "Senior Data Engineer",
        "weight": 0.24,
        "exp_range": (4, 8),
        "salary_range": (48_000_000, 88_000_000),
        "primary_skills": ["Python", "SQL", "Spark", "Kafka", "Airflow", "AWS", "Snowflake", "Databricks", "dbt", "Docker"],
        "optional_skills": ["Kubernetes", "Flink", "Scala", "Java", "GCP", "Azure", "BigQuery", "Terraform", "ClickHouse", "Elasticsearch"],
        "descriptions": [
            "Lead the technical design and architectural evolution of enterprise data lakes and data streaming infrastructure for millions of daily active users.",
            "Spearhead large-scale data platform modernization, mentor junior data engineers, enforce best practices in CI/CD, data governance, and distributed computing.",
            "Architect and optimize high-throughput distributed data systems using Apache Spark, Kafka, and Snowflake/Databricks with strict SLAs.",
            "Design highly available, cost-effective data pipelines and lakehouse solutions. Drive data engineering standards, monitoring, and infrastructure as code."
        ]
    },
    {
        "title": "Lead Data Engineer",
        "weight": 0.06,
        "exp_range": (6, 12),
        "salary_range": (75_000_000, 140_000_000),
        "primary_skills": ["Python", "SQL", "Spark", "Kafka", "Airflow", "AWS", "Databricks", "Kubernetes", "Architecture", "Data Governance"],
        "optional_skills": ["GCP", "Azure", "Snowflake", "Terraform", "Flink", "Java", "Scala", "ClickHouse", "Presto"],
        "descriptions": [
            "Provide strategic leadership and architectural oversight for the entire data engineering department. Align data strategy with overarching corporate objectives.",
            "Lead a high-performing team of data and analytics engineers, establish engineering excellence, define platform roadmap, and manage cloud infrastructure budgets.",
            "Direct the engineering lifecycle of mission-critical data platforms, enterprise lakehouses, and real-time streaming backbones."
        ]
    },
    {
        "title": "Analytics Engineer",
        "weight": 0.05,
        "exp_range": (2, 5),
        "salary_range": (28_000_000, 56_000_000),
        "primary_skills": ["SQL", "dbt", "Python", "Snowflake", "BigQuery", "Data Modeling", "Looker", "Tableau", "Airflow"],
        "optional_skills": ["PostgreSQL", "AWS", "Power BI", "Metabase", "ClickHouse", "Git", "Redshift"],
        "descriptions": [
            "Bridge the gap between data engineering and business analytics. Transform raw transactional data into clean, well-documented, test-driven data models using dbt and SQL.",
            "Build analytics-ready data marts, manage semantic layers, automate BI dashboards, and maintain high standards of data governance.",
            "Partner with product managers and business stakeholders to design dimensional models and deliver actionable analytical datasets across the organization."
        ]
    },
    {
        "title": "Big Data Engineer",
        "weight": 0.03,
        "exp_range": (3, 7),
        "salary_range": (35_000_000, 70_000_000),
        "primary_skills": ["Hadoop", "Spark", "Hive", "Kafka", "Python", "Java", "SQL", "Scala", "Flink"],
        "optional_skills": ["HBase", "Cassandra", "Airflow", "AWS", "GCP", "Elasticsearch", "Docker"],
        "descriptions": [
            "Build and scale massive distributed storage and processing systems handling terabytes to petabytes of structured and semi-structured log data.",
            "Maintain distributed computing clusters (Hadoop, Spark, Kafka), tuning shuffle performance, and orchestrating batch ETL workloads."
        ]
    },
    {
        "title": "Cloud Data Engineer",
        "weight": 0.02,
        "exp_range": (3, 6),
        "salary_range": (35_000_000, 68_000_000),
        "primary_skills": ["AWS", "Azure", "GCP", "Python", "SQL", "Airflow", "Terraform", "Docker", "Snowflake"],
        "optional_skills": ["Glue", "EMR", "BigQuery", "Data Factory", "Synapse", "Redshift", "Databricks", "Kubernetes"],
        "descriptions": [
            "Architect and implement cloud-native data pipelines, serverless workflows, and infrastructure as code across AWS, Azure, or GCP environments."
        ]
    }
]

def choose_location():
    locs, weights = zip(*LOCATIONS)
    return np.random.choice(locs, p=weights)

def choose_source():
    sources, weights, urls = zip(*[(s[0], s[1], s[2]) for s in SOURCES])
    idx = np.random.choice(len(sources), p=weights)
    return sources[idx], urls[idx]

def generate_records(count=NUM_RECORDS):
    role_weights = [r["weight"] for r in ROLE_CONFIGS]
    role_indices = np.random.choice(len(ROLE_CONFIGS), size=count, p=role_weights)

    # Generate dates spanning 2024-01-01 to 2026-08-27
    end_date = datetime(2026, 8, 27)
    
    records = []
    
    for i in range(1, count + 1):
        if i < 1000:
            job_id = f"DE{i:03d}"
        else:
            job_id = f"DE{i}"
            
        if i == 1:
            records.append({
                "job_id": "DE001",
                "title": "Data Engineer",
                "company": "FPT Software",
                "location": "Ho Chi Minh City",
                "salary_min": 25000000.0,
                "salary_max": 40000000.0,
                "salary_currency": "VND",
                "experience_min": 2.0,
                "experience_max": 4.0,
                "employment_type": "Full-time",
                "remote": False,
                "description": "Build and maintain scalable data pipelines for enterprise clients. Work with big data technologies and cloud platforms.",
                "skills": "Python|SQL|Spark|AWS|Airflow",
                "source": "TopDev",
                "url": "https://topdev.vn/job/de001",
                "posted_date": "2026-08-10",
                "scraped_at": "2026-08-14"
            })
            continue

        role = ROLE_CONFIGS[role_indices[i - 1]]
        title = role["title"]
        company = random.choice(COMPANIES)
        location = choose_location()
        source, base_url = choose_source()
        url = f"{base_url}{job_id.lower()}"

        # Experience
        exp_min_base, exp_max_base = role["exp_range"]
        exp_min = random.choice([exp_min_base, exp_min_base + (1 if exp_min_base > 0 else 0)])
        exp_max = exp_min + random.randint(1, 4)
        if exp_max < exp_min:
            exp_max = exp_min + 2

        # Salary
        has_salary = random.random() > 0.12  # 88% have specified salary
        if has_salary:
            s_low, s_high = role["salary_range"]
            # Add some slight variation
            variance = random.uniform(0.85, 1.25)
            s_min = int(round(s_low * variance / 1_000_000) * 1_000_000)
            diff = random.randint(10_000_000, 30_000_000)
            s_max = int(round((s_min + diff) / 1_000_000) * 1_000_000)
            salary_min = s_min
            salary_max = s_max
            salary_currency = "VND"
        else:
            salary_min = np.nan
            salary_max = np.nan
            salary_currency = "VND"

        # Employment Type
        emp_type = np.random.choice(
            ["Full-time", "Contract", "Part-time", "Internship"],
            p=[0.92, 0.04, 0.02, 0.02]
        )

        # Remote
        remote = bool(np.random.choice([True, False], p=[0.18, 0.82]))

        # Skills
        num_primary = random.randint(3, min(6, len(role["primary_skills"])))
        selected_primary = random.sample(role["primary_skills"], num_primary)
        num_optional = random.randint(1, min(4, len(role["optional_skills"])))
        selected_optional = random.sample(role["optional_skills"], num_optional)
        
        # Always ensure Python & SQL are widely present for Data Engineer roles
        combined_skills = list(dict.fromkeys(selected_primary + selected_optional))
        random.shuffle(combined_skills)
        skills_str = "|".join(combined_skills)

        # Description
        desc_template = random.choice(role["descriptions"])
        description = f"{desc_template} Primary technologies include {', '.join(combined_skills[:4])}."

        # Dates
        if random.random() < 0.75:
            days_ago = random.randint(0, 180)
        else:
            days_ago = random.randint(181, 750)
        
        posted_dt = end_date - timedelta(days=days_ago)
        scraped_dt = posted_dt + timedelta(days=random.randint(1, 5))
        if scraped_dt > end_date:
            scraped_dt = end_date

        posted_date = posted_dt.strftime("%Y-%m-%d")
        scraped_at = scraped_dt.strftime("%Y-%m-%d")

        records.append({
            "job_id": job_id,
            "title": title,
            "company": company,
            "location": location,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "salary_currency": salary_currency,
            "experience_min": exp_min,
            "experience_max": exp_max,
            "employment_type": emp_type,
            "remote": remote,
            "description": description,
            "skills": skills_str,
            "source": source,
            "url": url,
            "posted_date": posted_date,
            "scraped_at": scraped_at
        })

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    print(f"Generating {NUM_RECORDS} Data Engineer job records...")
    df = generate_records(NUM_RECORDS)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")
    print(f"Successfully wrote {len(df)} records to {OUTPUT_FILE}")
    print(df.head(5))
