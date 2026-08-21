-- =========================================================
-- Table: jobs
-- Description: Stores data engineer job market listings in IBM DB2
-- =========================================================

CREATE TABLE jobs (
    job_id              VARCHAR(50)     NOT NULL PRIMARY KEY,
    title               VARCHAR(255)    NOT NULL,
    company             VARCHAR(255)    NOT NULL,
    location            VARCHAR(255),
    salary_min          DECIMAL(15, 2),
    salary_max          DECIMAL(15, 2),
    salary_currency     VARCHAR(10)     DEFAULT 'VND',
    experience_min      DECIMAL(4, 1),
    experience_max      DECIMAL(4, 1),
    employment_type     VARCHAR(50),
    remote              SMALLINT        DEFAULT 0,
    description         CLOB(1M),
    skills              VARCHAR(1000),
    source              VARCHAR(100),
    url                 VARCHAR(1000),
    posted_date         DATE,
    scraped_at          DATE
);

-- Secondary indexes for performance optimization
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date);
CREATE INDEX idx_jobs_source ON jobs(source);
