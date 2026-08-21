-- =========================================================
-- Sample Data Insertion for jobs table (IBM DB2)
-- =========================================================

INSERT INTO jobs (
    job_id, title, company, location, salary_min, salary_max, salary_currency,
    experience_min, experience_max, employment_type, remote, description,
    skills, source, url, posted_date, scraped_at
) VALUES
(
    'DE001', 'Data Engineer', 'FPT Software', 'Ho Chi Minh City',
    25000000.00, 40000000.00, 'VND', 2.0, 4.0, 'Full-time', 0,
    'Build and maintain scalable data pipelines for enterprise clients. Work with big data technologies and cloud platforms.',
    'Python|SQL|Spark|AWS|Airflow', 'TopDev', 'https://topdev.vn/job/de001',
    DATE('2026-08-10'), DATE('2026-08-14')
),
(
    'DE002', 'Senior Data Engineer', 'Tiki', 'Ho Chi Minh City',
    45000000.00, 70000000.00, 'VND', 4.0, 7.0, 'Full-time', 0,
    'Lead data engineering team to build real-time data infrastructure for e-commerce platform with millions of transactions.',
    'Python|Kafka|Spark|GCP|Airflow|SQL|dbt', 'TopDev', 'https://topdev.vn/job/de002',
    DATE('2026-08-12'), DATE('2026-08-14')
),
(
    'DE006', 'Analytics Engineer', 'MoMo', 'Ho Chi Minh City',
    35000000.00, 55000000.00, 'VND', 2.0, 5.0, 'Full-time', 1,
    'Transform raw data into analytics-ready datasets using dbt and SQL. Partner with data analysts and business teams.',
    'SQL|dbt|Python|BigQuery|Airflow|Looker', 'TopDev', 'https://topdev.vn/job/de006',
    DATE('2026-08-09'), DATE('2026-08-14')
),
(
    'DE008', 'Data Engineer', 'Techcombank', 'Hanoi',
    30000000.00, 48000000.00, 'VND', 2.0, 5.0, 'Full-time', 0,
    'Develop and maintain data pipelines for banking analytics and regulatory reporting.',
    'Python|SQL|ETL|Oracle|Informatica|SSIS', 'TopDev', 'https://topdev.vn/job/de008',
    DATE('2026-08-12'), DATE('2026-08-14')
),
(
    'DE009', 'Senior Data Engineer', 'VPBank', 'Hanoi',
    45000000.00, 68000000.00, 'VND', 5.0, 8.0, 'Full-time', 0,
    'Lead design and implementation of enterprise data warehouse and data lake solutions for leading Vietnamese bank.',
    'Python|SQL|Spark|Azure|dbt|Airflow|Power BI', 'ITviec', 'https://itviec.com/job/de009',
    DATE('2026-08-10'), DATE('2026-08-14')
);
