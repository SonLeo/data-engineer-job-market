# 🇻🇳 Vietnam Data Engineer Job Market

Web application phân tích thị trường việc làm **Data Engineer tại Việt Nam**, được xây dựng nhằm thu thập, xử lý, phân tích và trực quan hóa dữ liệu tuyển dụng.

Dự án được phát triển theo từng giai đoạn, bắt đầu từ **Phase 1 — MVP** và có định hướng mở rộng thành một nền tảng **Data Engineer Job Market Intelligence** hoàn chỉnh.

---

## 🎯 Project Goal

Mục tiêu của dự án là xây dựng một hệ thống giúp trả lời các câu hỏi:

- Việt Nam hiện có bao nhiêu việc làm Data Engineer?
- Những công ty nào đang tuyển Data Engineer nhiều nhất?
- Thành phố nào có nhiều cơ hội việc làm nhất?
- Mức lương Data Engineer phổ biến là bao nhiêu?
- Kinh nghiệm ảnh hưởng như thế nào đến mức lương?
- Những kỹ năng nào được yêu cầu nhiều nhất?
- Những kỹ năng nào thường xuất hiện cùng nhau?
- Thị trường Data Engineer đang tăng hay giảm?
- Người muốn trở thành Data Engineer nên tập trung học kỹ năng nào?

---

## 🚀 Phase 1 — MVP

Phiên bản MVP tập trung vào 6 chức năng chính:

```
Dashboard
    ↓
Job Search
    ↓
Job Detail
    ↓
Salary Analytics
    ↓
Skills Analytics
    ↓
Location Analytics
```

### 1. Dashboard

Cung cấp cái nhìn tổng quan về thị trường việc làm.

**Các chỉ số chính:**

- Total Jobs
- Total Companies
- Median Salary
- Average Salary
- Highest Salary
- New Jobs
- Jobs by Location
- Top Skills
- Job Market Trend

### 2. Job Search

Cho phép người dùng tìm kiếm và lọc việc làm.

**Các bộ lọc dự kiến:**

- Keyword
- Location
- Experience
- Salary
- Employment Type
- Remote / On-site / Hybrid
- Skills
- Posted Date

**Ví dụ:**

```
Data Engineer
Python
SQL
AWS
Hanoi
Junior
20M - 35M
```

### 3. Job Detail

Hiển thị thông tin chi tiết của một công việc:

- Job Title
- Company
- Location
- Salary
- Experience
- Employment Type
- Remote Status
- Required Skills
- Job Description
- Job Requirements
- Source
- Original Job URL
- Posted Date

### 4. Salary Analytics

Phân tích mức lương Data Engineer tại Việt Nam.

**Các phân tích dự kiến:**

- Average Salary
- Median Salary
- Minimum Salary
- Maximum Salary
- Salary Distribution
- Salary by Experience
- Salary by Location
- Salary by Skill

**Ví dụ:**

| Experience | Median Salary |
|------------|----------------|
| Fresher    | 10M            |
| Junior     | 18M            |
| Middle     | 28M            |
| Senior     | 42M            |
| Lead       | 55M            |

### 5. Skills Analytics

Phân tích các kỹ năng được yêu cầu trong Job Description.

**Ví dụ:**

| Skill   | Tỷ lệ xuất hiện |
|---------|------------------|
| SQL     | 78%              |
| Python  | 72%              |
| AWS     | 43%              |
| Airflow | 39%              |
| Spark   | 36%              |
| Kafka   | 27%              |
| Docker  | 25%              |

**Các phân tích dự kiến:**

- Top Skills
- Skill Frequency
- Skill Trend
- Skill Combination
- Skills by Experience
- Skills by Location
- Skills by Salary Range

### 6. Location Analytics

Phân tích nhu cầu tuyển dụng theo địa điểm.

**Các khu vực dự kiến:**

- Hà Nội
- Hồ Chí Minh
- Đà Nẵng
- Hải Phòng
- Bình Dương
- Remote
- Other

**Các chỉ số:**

- Number of Jobs
- Median Salary
- Average Salary
- Top Skills
- Hiring Companies

---

## 🏗️ Project Architecture

Kiến trúc Phase 1:

```
                    ┌──────────────┐
                    │   jobs.csv   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Flask     │
                    │    api.py    │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Dashboard        Jobs        Analytics
                           │             │
                           │      ┌──────┼──────┐
                           │      │      │      │
                           ▼      ▼      ▼      ▼
                      Job Detail Salary Skills Location
```

---

## 📁 Project Structure

```
data-engineer-job-market/
│
├── api.py
│
├── data/
│   └── jobs.csv
│
├── templates/
│   ├── index.html
│   ├── jobs.html
│   ├── job-detail.html
│   ├── salary.html
│   ├── skills.html
│   └── locations.html
│
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   ├── jobs.css
│   │   └── analytics.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── dashboard.js
│   │   ├── jobs.js
│   │   ├── job-detail.js
│   │   ├── salary.js
│   │   ├── skills.js
│   │   ├── locations.js
│   │   └── charts.js
│   │
│   └── assets/
│
├── tests/
│   └── test_api.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

### Backend

- Python
- Flask
- Pandas
- NumPy

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js

### Data

Phase 1 sử dụng:

```
CSV
 ↓
Pandas
 ↓
Data Analysis
 ↓
Flask API
 ↓
JavaScript
 ↓
Dashboard
```

### Testing

- pytest

---

## 📊 Dataset

Dataset chính:

```
data/jobs.csv
```

**Các trường dữ liệu dự kiến:**

- job_id
- title
- company
- location
- salary_min
- salary_max
- salary_currency
- experience_min
- experience_max
- employment_type
- remote
- description
- skills
- source
- url
- posted_date
- scraped_at

**Ví dụ:**

```csv
job_id,title,company,location,salary_min,salary_max,salary_currency,experience_min,experience_max,employment_type,remote,description,skills,source,url,posted_date,scraped_at
001,Data Engineer,ABC Technology,Ho Chi Minh City,25000000,40000000,VND,2,4,Full-time,False,Build and maintain data pipelines,Python|SQL|Airflow|AWS|Spark,TopDev,https://example.com/job/001,2026-08-14,2026-08-14
```

---

## 🔌 API Endpoints

### Dashboard

```
GET /api/dashboard
```

Trả về các thông tin tổng quan:

```json
{
    "total_jobs": 1245,
    "total_companies": 328,
    "median_salary": 28000000,
    "average_salary": 30500000,
    "highest_salary": 80000000,
    "new_jobs": 126
}
```

### Jobs

```
GET /api/jobs
```

Tìm kiếm tất cả jobs.

**Ví dụ:**

```
GET /api/jobs?keyword=data engineer
GET /api/jobs?location=Hanoi
GET /api/jobs?experience=junior
```

### Job Detail

```
GET /api/jobs/<job_id>
```

**Ví dụ:**

```
GET /api/jobs/001
```

### Salary Analytics

```
GET /api/analytics/salary
```

### Skills Analytics

```
GET /api/analytics/skills
```

### Location Analytics

```
GET /api/analytics/locations
```

---

## ⚙️ Installation

### 1. Clone repository

```bash
git clone https://github.com/your-username/data-engineer-job-market.git
```

Di chuyển vào thư mục:

```bash
cd data-engineer-job-market
```

### 2. Tạo Virtual Environment

**Windows:**

```bash
python -m venv venv
```

Kích hoạt:

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

> 💡 **Lưu ý:** Trong `requirements.txt`, không nên khóa version một cách quá cứng nếu bạn chưa có lý do cụ thể. Nếu mục tiêu là làm project học tập trên máy hiện tại, bạn có thể dùng:
>
> ```txt
> Flask
> pandas
> numpy
> pytest
> ```

---

## ▶️ Run Application

Chạy:

```bash
python api.py
```

Sau khi Flask khởi động, mở:

```
http://127.0.0.1:5000
```

---

## 🧪 Run Tests

Chạy toàn bộ test:

```bash
pytest
```

Chạy test với output chi tiết:

```bash
pytest -v
```

---

## 📈 Development Roadmap

### Phase 1 — MVP

- [x] Project structure
- [x] Dataset
- [x] Flask API
- [x] Dashboard
- [x] Job Search
- [x] Job Detail
- [x] Salary Analytics
- [x] Skills Analytics
- [x] Location Analytics
- [x] Basic testing

### Phase 2 — Data Collection & ETL

Mở rộng hệ thống bằng cách thu thập dữ liệu việc làm tự động:

```
Job Sources
    ↓
Web Scraping
    ↓
Raw Data
    ↓
Data Cleaning
    ↓
Data Transformation
    ↓
Processed Data
```

**Dự kiến:**

- Web Scraping
- Data Cleaning
- Data Validation
- Duplicate Detection
- Data Normalization
- Automated ETL
- Incremental Data Loading

### Phase 3 — Data Engineering Platform

Xây dựng pipeline hoàn chỉnh:

```
Sources
   ↓
Scraper
   ↓
Raw Storage
   ↓
ETL / ELT
   ↓
Data Warehouse
   ↓
Analytics API
   ↓
Dashboard
```

**Công nghệ dự kiến:**

- PostgreSQL
- SQL
- Docker
- Apache Airflow
- Cloud Storage
- Data Warehouse
- CI/CD

### Phase 4 — Job Market Intelligence

Bổ sung các tính năng phân tích nâng cao:

**Job Description Intelligence**

- Extract Skills
- Extract Experience
- Extract Salary
- Extract Location
- Extract Technology Stack

**Skill Intelligence**

- Skill Demand
- Skill Trend
- Skill Correlation
- Skill Salary Impact

**Job Matching**

```
CV
 ↓
Extract Skills
 ↓
Compare Job Requirements
 ↓
Job Match Score
```

**Career Recommendation**

Hệ thống đề xuất:

- Skills cần học
- Jobs phù hợp
- Công nghệ nên học
- Mức lương kỳ vọng
- Lộ trình phát triển nghề nghiệp

---

## 🎯 Future Vision

Mục tiêu cuối cùng của dự án:

```
                 VIETNAM DATA JOB MARKET
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   Job Search          Analytics          Intelligence
        │                  │                  │
        │             ┌────┼────┐        ┌────┼────┐
        │             │    │    │        │    │    │
        ▼             ▼    ▼    ▼        ▼    ▼    ▼
      Jobs         Salary Skills Location  NLP  AI  Match
        │
        ▼
   Application
   Tracking
        │
        ▼
   Career Assistant
```

Dự án hướng tới trở thành một nền tảng **Data Engineer Job Market Intelligence Platform** dành cho thị trường Việt Nam.

---

## 👨‍💻 Learning Objectives

Thông qua dự án này, các kỹ năng được thực hành:

**Python**

- Python fundamentals
- Functions
- Data structures
- Error handling
- File processing

**Pandas**

- Data loading
- Data cleaning
- Data transformation
- GroupBy
- Aggregation
- Data analysis

**Flask**

- REST API
- Routing
- Query parameters
- JSON response
- API architecture

**Frontend**

- HTML
- CSS
- JavaScript
- Fetch API
- DOM manipulation
- Chart.js
- Responsive UI

**Data Engineering**

- Data pipeline
- ETL
- Data quality
- Data warehouse
- API integration
- Automation

---

## 📌 Project Status

- **Current Version:** Phase 1 — MVP
- **Status:** In Development

---

## 📄 License

This project is created for learning, portfolio development and educational purposes.
