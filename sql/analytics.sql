-- =========================================================
-- Analytics Queries for Vietnam Data Engineer Job Market (IBM DB2)
-- =========================================================

-- 1. Overview KPIs
SELECT 
    COUNT(*) AS total_jobs,
    COUNT(DISTINCT company) AS total_companies,
    AVG((COALESCE(salary_min, salary_max) + COALESCE(salary_max, salary_min)) / 2.0) AS avg_salary,
    MAX(salary_max) AS max_salary,
    SUM(CASE WHEN remote = 1 THEN 1 ELSE 0 END) AS remote_jobs_count
FROM jobs;

-- 2. Top Hiring Companies
SELECT 
    company, 
    COUNT(*) AS job_count,
    AVG((COALESCE(salary_min, salary_max) + COALESCE(salary_max, salary_min)) / 2.0) AS avg_salary
FROM jobs
GROUP BY company
ORDER BY job_count DESC, avg_salary DESC
FETCH FIRST 10 ROWS ONLY;

-- 3. Job Distribution and Average Salary by Location
SELECT 
    location,
    COUNT(*) AS job_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM jobs), 2) AS percentage,
    AVG((COALESCE(salary_min, salary_max) + COALESCE(salary_max, salary_min)) / 2.0) AS avg_salary
FROM jobs
GROUP BY location
ORDER BY job_count DESC;

-- 4. Salary Stats by Experience Level Buckets
SELECT 
    CASE 
        WHEN experience_max <= 1 THEN 'Entry (0-1y)'
        WHEN experience_max <= 2 THEN 'Junior (1-2y)'
        WHEN experience_max <= 4 THEN 'Mid (2-4y)'
        WHEN experience_max <= 7 THEN 'Senior (4-7y)'
        ELSE 'Principal (7y+)'
    END AS exp_level,
    COUNT(*) AS job_count,
    AVG((COALESCE(salary_min, salary_max) + COALESCE(salary_max, salary_min)) / 2.0) AS avg_salary,
    MIN(salary_min) AS min_salary,
    MAX(salary_max) AS max_salary
FROM jobs
WHERE salary_min IS NOT NULL OR salary_max IS NOT NULL
GROUP BY 
    CASE 
        WHEN experience_max <= 1 THEN 'Entry (0-1y)'
        WHEN experience_max <= 2 THEN 'Junior (1-2y)'
        WHEN experience_max <= 4 THEN 'Mid (2-4y)'
        WHEN experience_max <= 7 THEN 'Senior (4-7y)'
        ELSE 'Principal (7y+)'
    END
ORDER BY avg_salary ASC;

-- 5. Monthly Job Postings Trend
SELECT 
    VARCHAR_FORMAT(posted_date, 'YYYY-MM') AS post_month,
    COUNT(*) AS job_count
FROM jobs
WHERE posted_date IS NOT NULL
GROUP BY VARCHAR_FORMAT(posted_date, 'YYYY-MM')
ORDER BY post_month ASC;

-- 6. Remote vs On-site Breakdown
SELECT 
    CASE WHEN remote = 1 THEN 'Remote' ELSE 'On-site / Hybrid' END AS work_mode,
    COUNT(*) AS job_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM jobs), 2) AS percentage,
    AVG((COALESCE(salary_min, salary_max) + COALESCE(salary_max, salary_min)) / 2.0) AS avg_salary
FROM jobs
GROUP BY remote;
