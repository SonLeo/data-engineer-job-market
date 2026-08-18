# AI CODING SKILL

# Vietnam Data Engineer Job Market — Phase 1 MVP

---

# 1. ROLE

Bạn là một Senior Full-Stack Developer đồng thời là Data Engineer.

Nhiệm vụ của bạn là đọc toàn bộ repository hiện tại và xây dựng hoàn chỉnh **Phase 1 — MVP** của dự án:

> Vietnam Data Engineer Job Market

Mục tiêu là tạo một Web App phân tích thị trường việc làm Data Engineer tại Việt Nam.

Bạn phải:

1. Phân tích cấu trúc repository hiện tại.
2. Kiểm tra các file đã tồn tại.
3. Không phá hỏng code đang hoạt động.
4. Tạo các file còn thiếu.
5. Hoàn thiện Backend.
6. Hoàn thiện Frontend.
7. Kết nối Frontend với Backend.
8. Xử lý dữ liệu CSV bằng Pandas.
9. Xây dựng các API cần thiết.
10. Xây dựng Dashboard và các trang Analytics.
11. Thêm validation và error handling.
12. Thêm test cơ bản.
13. Chạy kiểm tra toàn bộ ứng dụng.
14. Sửa các lỗi phát sinh.
15. Chỉ kết thúc khi Phase 1 có thể chạy được từ đầu đến cuối.

---

# 2. PROJECT OBJECTIVE

Ứng dụng phải giúp người dùng phân tích thị trường việc làm Data Engineer tại Việt Nam.

Phase 1 bao gồm 6 module chính:

```text
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

Ứng dụng phải có giao diện chuyên nghiệp, hiện đại, responsive và có cảm giác giống một sản phẩm Data Analytics thực tế.

Đây là một project Portfolio hướng tới vị trí:

* Data Engineer
* Analytics Engineer
* Data Analyst
* Full-Stack Developer có nền tảng Data

Do đó code phải thể hiện được:

* Data processing
* REST API
* Data analysis
* Visualization
* Frontend development
* Clean architecture
* Testing
* Error handling

---

# 3. IMPORTANT SCOPE RULE

## CHỈ XÂY DỰNG PHASE 1

Không triển khai các tính năng của Phase 2, Phase 3 hoặc Phase 4.

Không tự ý thêm:

* Web scraping
* Selenium
* BeautifulSoup scraping
* Airflow
* Kafka
* PostgreSQL
* Data Warehouse
* Docker
* Cloud
* AI
* NLP
* CV analysis
* Job matching
* Career recommendation
* Authentication
* Payment
* Application tracking

Các tính năng trên sẽ được triển khai ở các Phase sau.

Phase 1 chỉ sử dụng:

```text
CSV
 ↓
Pandas
 ↓
Flask API
 ↓
HTML
CSS
JavaScript
 ↓
Chart.js
```

---

# 4. TECHNOLOGY STACK

## Backend

Sử dụng:

* Python
* Flask
* Pandas
* NumPy

## Frontend

Sử dụng:

* HTML5
* CSS3
* Vanilla JavaScript
* Fetch API
* Chart.js

## Testing

Sử dụng:

* pytest

Không sử dụng React, Vue hoặc Angular trong Phase 1.

---

# 5. PROJECT STRUCTURE

Cấu trúc project mục tiêu:

```text
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
├── README.md
└── skills.md
```

Nếu repository hiện tại có cấu trúc khác, hãy ưu tiên giữ lại những thành phần đang hoạt động và điều chỉnh hợp lý.

Không tạo cấu trúc phức tạp không cần thiết.

---

# 6. DATA SOURCE

Nguồn dữ liệu chính:

```text
data/jobs.csv
```

Backend phải đọc dữ liệu bằng Pandas.

Ví dụ:

```python
import pandas as pd

df = pd.read_csv("data/jobs.csv")
```

Không hard-code dữ liệu analytics vào Frontend.

Tất cả số liệu trên Dashboard phải được tính từ dataset.

---

# 7. DATA SCHEMA

Dataset nên có các trường:

```text
job_id
title
company
location
salary_min
salary_max
salary_currency
experience_min
experience_max
employment_type
remote
description
skills
source
url
posted_date
scraped_at
```

Ví dụ:

```csv
job_id,title,company,location,salary_min,salary_max,salary_currency,experience_min,experience_max,employment_type,remote,description,skills,source,url,posted_date,scraped_at
001,Data Engineer,ABC Technology,Ho Chi Minh City,25000000,40000000,VND,2,4,Full-time,False,Build and maintain data pipelines,Python|SQL|Airflow|AWS|Spark,TopDev,https://example.com/job/001,2026-08-14,2026-08-14
```

Nếu dataset hiện tại có tên cột khác:

1. Đọc dataset.
2. Phân tích schema.
3. Mapping về schema chuẩn.
4. Không phá hỏng dữ liệu gốc nếu không cần thiết.

---

# 8. DATA CLEANING

Trước khi thực hiện analytics, Backend phải xử lý dữ liệu an toàn.

Các trường cần kiểm tra:

```text
job_id
title
company
location
salary_min
salary_max
experience_min
experience_max
skills
posted_date
```

Phải xử lý:

* Missing values
* Invalid numbers
* Duplicate job_id
* Empty strings
* Invalid salary
* Invalid experience
* Invalid dates

Không để một record lỗi làm toàn bộ API crash.

---

# 9. SALARY CALCULATION

Nếu dataset có:

```text
salary_min
salary_max
```

Tạo salary midpoint:

```python
salary_mid = (salary_min + salary_max) / 2
```

Nếu chỉ có `salary_min`:

```text
salary_mid = salary_min
```

Nếu chỉ có `salary_max`:

```text
salary_mid = salary_max
```

Nếu không có salary:

```text
salary_mid = NaN
```

Không coi salary không xác định là 0.

---

# 10. EXPERIENCE CALCULATION

Nếu có:

```text
experience_min
experience_max
```

Có thể tạo:

```text
experience_mid
```

theo:

```python
experience_mid = (experience_min + experience_max) / 2
```

Nếu không có dữ liệu experience, không tự ý gán giá trị.

---

# 11. SKILL PARSING

Trường `skills` có thể có dạng:

```text
Python|SQL|AWS|Airflow|Spark
```

Backend phải parse thành danh sách:

```python
[
    "Python",
    "SQL",
    "AWS",
    "Airflow",
    "Spark"
]
```

Phải:

* Trim whitespace.
* Loại bỏ skill rỗng.
* Chuẩn hóa chữ hoa/chữ thường khi cần.
* Không tạo duplicate skill trong cùng một job.

---

# 12. APPLICATION ENTRY POINT

File chính:

```text
api.py
```

Ứng dụng phải có:

```python
from flask import Flask

app = Flask(__name__)
```

Có route:

```text
/
```

để render Dashboard.

Chạy ứng dụng bằng:

```bash
python api.py
```

Ứng dụng phải chạy tại:

```text
http://127.0.0.1:5000
```

---

# 13. FLASK CONFIGURATION

Trong development có thể sử dụng:

```python
if __name__ == "__main__":
    app.run(debug=True)
```

Không hard-code đường dẫn tuyệt đối của máy người dùng.

Sai:

```python
pd.read_csv(r"E:\LEARN\DE\MindX\data\jobs.csv")
```

Đúng:

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "jobs.csv"
```

---

# 14. FRONTEND ROUTES

Flask phải render các trang:

```text
/
```

Dashboard

```text
/jobs
```

Job Search

```text
/jobs/<job_id>
```

Job Detail

```text
/salary
```

Salary Analytics

```text
/skills
```

Skills Analytics

```text
/locations
```

Location Analytics

---

# 15. API DESIGN

Backend phải cung cấp các API sau.

---

## 15.1 Dashboard API

```http
GET /api/dashboard
```

Response:

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

Các giá trị phải được tính động từ dataset.

---

# 16. JOB SEARCH API

```http
GET /api/jobs
```

API phải hỗ trợ:

```text
keyword
location
experience
salary_min
salary_max
remote
page
per_page
```

Ví dụ:

```text
/api/jobs?keyword=Data Engineer
```

```text
/api/jobs?location=Hanoi
```

```text
/api/jobs?remote=true
```

```text
/api/jobs?experience=junior
```

---

# 17. JOB SEARCH LOGIC

`keyword` phải có khả năng tìm kiếm trong ít nhất:

```text
title
company
description
skills
```

Search không phân biệt hoa thường.

Ví dụ:

```text
data engineer
Data Engineer
DATA ENGINEER
```

đều phải tìm được.

---

# 18. PAGINATION

API `/api/jobs` phải hỗ trợ pagination.

Ví dụ:

```text
/api/jobs?page=1&per_page=20
```

Response nên có:

```json
{
    "data": [],
    "pagination": {
        "page": 1,
        "per_page": 20,
        "total": 1245,
        "total_pages": 63
    }
}
```

Không trả về toàn bộ dataset nếu không cần thiết.

---

# 19. JOB DETAIL API

```http
GET /api/jobs/<job_id>
```

Nếu tồn tại:

```json
{
    "job_id": "001",
    "title": "Data Engineer",
    "company": "ABC Technology",
    "location": "Ho Chi Minh City",
    "salary_min": 25000000,
    "salary_max": 40000000,
    "skills": [
        "Python",
        "SQL",
        "AWS",
        "Airflow",
        "Spark"
    ]
}
```

Nếu không tồn tại:

```http
404
```

Response:

```json
{
    "error": "Job not found"
}
```

---

# 20. SALARY ANALYTICS API

```http
GET /api/analytics/salary
```

API phải trả về dữ liệu phục vụ:

1. Salary overview
2. Salary distribution
3. Salary by experience
4. Salary by location
5. Salary by skill

Ví dụ:

```json
{
    "overview": {
        "average": 30500000,
        "median": 28000000,
        "minimum": 8000000,
        "maximum": 80000000
    },
    "by_experience": [],
    "by_location": [],
    "by_skill": []
}
```

---

# 21. SALARY ANALYTICS RULES

Không sử dụng salary bằng 0 trong các phép tính thống kê.

Không tính:

```text
0
```

là salary hợp lệ.

Nếu salary missing:

```text
exclude from salary statistics
```

nhưng job vẫn phải tồn tại trong Job Search.

---

# 22. SKILLS ANALYTICS API

```http
GET /api/analytics/skills
```

Phải trả về:

```text
Top Skills
Skill Frequency
Skill Percentage
Skill Combination
```

Ví dụ:

```json
{
    "top_skills": [
        {
            "skill": "SQL",
            "count": 900,
            "percentage": 72.3
        },
        {
            "skill": "Python",
            "count": 850,
            "percentage": 68.2
        }
    ]
}
```

---

# 23. LOCATION ANALYTICS API

```http
GET /api/analytics/locations
```

Phải trả về ít nhất:

```text
location
job_count
percentage
average_salary
median_salary
```

Ví dụ:

```json
{
    "locations": [
        {
            "location": "Ho Chi Minh City",
            "job_count": 612,
            "percentage": 49.1,
            "average_salary": 32000000,
            "median_salary": 30000000
        }
    ]
}
```

---

# 24. DASHBOARD UI

Dashboard phải có:

## Header

Hiển thị:

```text
Vietnam Data Engineer
Job Market
```

Có navigation:

```text
Dashboard
Jobs
Salary
Skills
Locations
```

---

# 25. DASHBOARD KPI CARDS

Hiển thị ít nhất:

```text
Total Jobs
Companies
Median Salary
Average Salary
New Jobs
Remote Jobs
```

Mỗi card nên có:

```text
Title
Value
Short description
```

Nếu có dữ liệu phù hợp:

```text
↑ 12.4%
```

---

# 26. DASHBOARD CHARTS

Dashboard phải có ít nhất:

### Job Trend

Line chart.

### Top Skills

Bar chart.

### Jobs by Location

Bar chart hoặc Doughnut chart.

### Salary Distribution

Histogram hoặc Bar chart.

### Latest Jobs

Table/List.

---

# 27. JOB SEARCH UI

Trang `/jobs` phải có:

```text
Search input
Location filter
Experience filter
Salary filter
Remote filter
Reset button
```

Danh sách Job phải hiển thị:

```text
Job title
Company
Location
Salary
Experience
Skills
Posted date
View detail
```

---

# 28. JOB DETAIL UI

Trang Job Detail phải có:

```text
Job Title
Company
Location
Salary
Experience
Employment Type
Remote
Skills
Description
Requirements
Source
Posted Date
```

Có button:

```text
View Original Job
```

Nếu `url` không tồn tại hoặc không hợp lệ:

```text
Button disabled
```

---

# 29. SALARY PAGE

Trang `/salary` phải có:

### KPI

```text
Average Salary
Median Salary
Highest Salary
Lowest Salary
```

### Charts

```text
Salary Distribution
Salary by Experience
Salary by Location
Salary by Skill
```

---

# 30. SKILLS PAGE

Trang `/skills` phải có:

### Top Skills

Bar chart.

### Skill Percentage

Doughnut hoặc bar chart.

### Skill Combination

Table.

Ví dụ:

```text
Python + SQL
Python + AWS
SQL + AWS
Python + Airflow
Spark + AWS
```

---

# 31. LOCATION PAGE

Trang `/locations` phải có:

### Job Count by Location

Bar chart.

### Salary by Location

Bar chart.

### Location Table

Columns:

```text
Location
Jobs
Percentage
Average Salary
Median Salary
```

---

# 32. NAVIGATION

Tất cả các trang phải có navigation thống nhất:

```text
Dashboard
Jobs
Salary
Skills
Locations
```

Navigation phải hoạt động thực tế.

Không để link:

```text
href="#"
```

nếu đó là chức năng đã được yêu cầu.

---

# 33. RESPONSIVE DESIGN

Website phải hoạt động trên:

```text
Desktop
Tablet
Mobile
```

Desktop:

```text
Sidebar + Content
```

Mobile:

```text
Top navigation
Content
```

Các chart phải tự co giãn.

Table trên mobile phải có:

```text
overflow-x: auto
```

---

# 34. UI DESIGN

Thiết kế theo phong cách:

```text
Modern
Professional
Data Dashboard
Minimal
Clean
Responsive
```

Ưu tiên:

* Card
* Grid
* Table
* Chart
* Badge
* Filter
* Sidebar
* Navigation

Không sử dụng thiết kế quá nhiều màu.

Không sử dụng gradient quá mức.

Không tạo giao diện giống landing page marketing.

Đây là một:

> Data Analytics Dashboard

không phải một:

> Marketing Website.

---

# 35. COLOR SYSTEM

Sử dụng một hệ thống màu thống nhất.

Ví dụ:

```text
Primary
Secondary
Success
Warning
Danger
Background
Card
Text
Muted
Border
```

Không hard-code màu khác nhau ở từng component nếu không cần thiết.

---

# 36. LOADING STATE

Khi gọi API phải có loading state.

Ví dụ:

```text
Loading dashboard...
```

hoặc skeleton loading.

Không để màn hình trống trong khi API đang chạy.

---

# 37. ERROR STATE

Nếu API lỗi:

```text
Unable to load data.
Please try again.
```

Không hiển thị:

```text
undefined
null
NaN
```

cho người dùng.

---

# 38. EMPTY STATE

Nếu không có Job:

```text
No jobs found.
Try changing your search filters.
```

Nếu không có salary:

```text
No salary data available.
```

---

# 39. NUMBER FORMATTING

Các số tiền VND phải được format dễ đọc.

Ví dụ:

```text
28000000
```

hiển thị:

```text
28,000,000 ₫
```

hoặc:

```text
28M ₫
```

Không hiển thị:

```text
2.8e+07
```

---

# 40. PERCENTAGE FORMATTING

Không hiển thị quá nhiều chữ số thập phân.

Sai:

```text
72.382918273%
```

Đúng:

```text
72.4%
```

hoặc:

```text
72%
```

---

# 41. DATE FORMATTING

Date phải được hiển thị dễ đọc.

Ví dụ:

```text
2026-08-14
```

hiển thị:

```text
14 Aug 2026
```

hoặc:

```text
14/08/2026
```

---

# 42. JAVASCRIPT ARCHITECTURE

Không viết toàn bộ JavaScript trong HTML.

Không viết:

```html
<script>
    // 500 lines
</script>
```

Thay vào đó:

```text
static/js/
```

Mỗi trang có JS riêng.

Ví dụ:

```text
dashboard.js
jobs.js
job-detail.js
salary.js
skills.js
locations.js
```

---

# 43. API.JS

Tất cả API request nên tập trung tại:

```text
static/js/api.js
```

Ví dụ:

```javascript
async function fetchDashboard() {}

async function fetchJobs(params) {}

async function fetchJobDetail(jobId) {}

async function fetchSalaryAnalytics() {}

async function fetchSkillsAnalytics() {}

async function fetchLocationAnalytics() {}
```

Các page JS không nên lặp lại code `fetch()` giống nhau.

---

# 44. CHART.JS

Sử dụng Chart.js để tạo biểu đồ.

Mỗi chart phải:

1. Có title.
2. Có label.
3. Có tooltip.
4. Responsive.
5. Không gây lỗi khi dataset rỗng.

Không tạo chart với:

```text
undefined
null
NaN
```

---

# 45. BACKEND CODE QUALITY

Code Python phải:

* Dễ đọc.
* Có function rõ ràng.
* Không lặp code không cần thiết.
* Có comment ở logic phức tạp.
* Sử dụng tên biến rõ nghĩa.
* Không hard-code đường dẫn.
* Không hard-code analytics.

Không viết một function Flask dài hàng trăm dòng nếu có thể tách logic.

---

# 46. DATA PROCESSING

Không xử lý Pandas nặng lặp lại không cần thiết trong mỗi request.

Nếu dataset nhỏ:

```text
load CSV
```

có thể được thực hiện khi app khởi động.

Nếu cần, tạo các helper function:

```text
load_data()
clean_data()
parse_skills()
calculate_salary()
```

---

# 47. ERROR HANDLING

API phải xử lý:

```text
File not found
Invalid query parameter
Invalid job_id
Missing dataset
Invalid data
```

Không để traceback Python hiển thị cho người dùng production UI.

---

# 48. API RESPONSE FORMAT

API nên trả JSON thống nhất.

Success:

```json
{
    "success": true,
    "data": {}
}
```

Error:

```json
{
    "success": false,
    "error": "Job not found"
}
```

Nếu cấu trúc project hiện tại đã sử dụng format khác nhưng đang hoạt động tốt, có thể giữ format hiện tại để tránh breaking change.

---

# 49. HTTP STATUS CODES

Sử dụng đúng HTTP status:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
500 Internal Server Error
```

Phase 1 chủ yếu sử dụng:

```text
200
400
404
500
```

---

# 50. TESTING

Tạo:

```text
tests/test_api.py
```

Phải test ít nhất:

### Dashboard

```text
GET /api/dashboard
```

Expected:

```text
200
JSON
```

### Jobs

```text
GET /api/jobs
```

### Job Detail

```text
GET /api/jobs/valid_id
```

### Invalid Job

```text
GET /api/jobs/non_existing_id
```

Expected:

```text
404
```

### Salary

```text
GET /api/analytics/salary
```

### Skills

```text
GET /api/analytics/skills
```

### Locations

```text
GET /api/analytics/locations
```

---

# 51. SECURITY BASICS

Không commit:

```text
.env
password
API key
secret key
credentials
```

Tạo `.gitignore` phù hợp.

Ít nhất:

```text
venv/
.env
__pycache__/
.pytest_cache/
*.pyc
.DS_Store
```

---

# 52. NO ABSOLUTE PATH

Không sử dụng:

```python
E:\LEARN\DE\...
C:\Users\...
```

Mọi path phải relative tới project.

Sử dụng:

```python
pathlib.Path
```

---

# 53. README

Sau khi hoàn thành project, README phải mô tả:

```text
Project Overview
Features
Architecture
Project Structure
Technology Stack
Dataset
API
Installation
Run
Testing
Roadmap
```

Nếu có endpoint mới, phải cập nhật README.

---

# 54. DEVELOPMENT WORKFLOW

Bạn phải làm theo thứ tự:

## Step 1

Inspect repository.

Kiểm tra:

```text
files
folders
existing code
dataset
dependencies
```

## Step 2

Chạy project hiện tại nếu có thể.

## Step 3

Kiểm tra dataset.

## Step 4

Xây dựng data loading và cleaning.

## Step 5

Xây dựng Flask routes.

## Step 6

Kiểm tra API bằng browser/curl/test.

## Step 7

Xây dựng Dashboard.

## Step 8

Xây dựng Job Search.

## Step 9

Xây dựng Job Detail.

## Step 10

Xây dựng Salary Analytics.

## Step 11

Xây dựng Skills Analytics.

## Step 12

Xây dựng Location Analytics.

## Step 13

Responsive UI.

## Step 14

Testing.

## Step 15

Debug.

## Step 16

Update README.

---

# 55. IMPLEMENTATION ORDER

Không cố gắng tạo toàn bộ file cùng lúc rồi mới debug.

Làm theo:

```text
1. Data
   ↓
2. Flask
   ↓
3. Dashboard API
   ↓
4. Dashboard UI
   ↓
5. Jobs API
   ↓
6. Job Search UI
   ↓
7. Job Detail API
   ↓
8. Job Detail UI
   ↓
9. Salary API
   ↓
10. Salary UI
   ↓
11. Skills API
   ↓
12. Skills UI
   ↓
13. Location API
   ↓
14. Location UI
   ↓
15. Testing
   ↓
16. Responsive
   ↓
17. Final Debug
```

---

# 56. DEFINITION OF DONE

Phase 1 chỉ được coi là hoàn thành khi tất cả các điều kiện sau đúng:

## Backend

* [ ] Flask chạy được.
* [ ] `/` hoạt động.
* [ ] `/jobs` hoạt động.
* [ ] `/jobs/<job_id>` hoạt động.
* [ ] `/salary` hoạt động.
* [ ] `/skills` hoạt động.
* [ ] `/locations` hoạt động.

## APIs

* [ ] `/api/dashboard`
* [ ] `/api/jobs`
* [ ] `/api/jobs/<job_id>`
* [ ] `/api/analytics/salary`
* [ ] `/api/analytics/skills`
* [ ] `/api/analytics/locations`

đều hoạt động.

## Frontend

* [ ] Dashboard hiển thị dữ liệu thật.
* [ ] Job Search hoạt động.
* [ ] Filter hoạt động.
* [ ] Pagination hoạt động.
* [ ] Job Detail hoạt động.
* [ ] Salary charts hoạt động.
* [ ] Skills charts hoạt động.
* [ ] Location charts hoạt động.
* [ ] Navigation hoạt động.
* [ ] Responsive hoạt động.

## Data

* [ ] CSV được đọc bằng Pandas.
* [ ] Missing data được xử lý.
* [ ] Salary được xử lý đúng.
* [ ] Skills được parse đúng.
* [ ] Duplicate được xử lý.
* [ ] Không có NaN hiển thị trên UI.

## Testing

* [ ] pytest chạy thành công.
* [ ] API tests pass.
* [ ] 404 được xử lý.
* [ ] Empty dataset được xử lý.

## Documentation

* [ ] README cập nhật.
* [ ] Installation instructions chính xác.
* [ ] API documentation chính xác.
* [ ] Project structure chính xác.

---

# 57. IMPORTANT CODING RULES

Luôn ưu tiên:

```text
Simple
Readable
Maintainable
Testable
Scalable
```

Không ưu tiên:

```text
Complex
Over-engineered
Unnecessary abstraction
Unnecessary dependencies
```

---

# 58. DO NOT

Không:

* Tạo dữ liệu giả để che lỗi.
* Hard-code KPI.
* Hard-code chart data.
* Hard-code salary.
* Hard-code số lượng jobs.
* Hard-code company statistics.
* Dùng absolute path.
* Đưa logic Pandas vào JavaScript.
* Đưa logic API vào HTML.
* Copy/paste cùng một logic ở nhiều nơi.
* Tạo API không được Frontend sử dụng.
* Tạo UI không có Backend data.
* Thêm dependency không cần thiết.
* Tự ý chuyển sang React.
* Tự ý chuyển sang FastAPI.
* Tự ý chuyển sang PostgreSQL.
* Tự ý triển khai Phase 2.

---

# 59. IMPORTANT DATA RULE

Tất cả các số liệu:

```text
Total Jobs
Companies
Salary
Skills
Locations
Trends
```

phải được tính từ:

```text
data/jobs.csv
```

Không được viết:

```python
total_jobs = 1245
```

Đúng:

```python
total_jobs = len(df)
```

---

# 60. FRONTEND DATA RULE

Frontend không được chứa dữ liệu analytics hard-code.

Sai:

```javascript
const totalJobs = 1245;
```

Đúng:

```javascript
const data = await fetchDashboard();
```

Sau đó render:

```javascript
document.getElementById("totalJobs").textContent =
    data.total_jobs;
```

---

# 61. FINAL VALIDATION

Trước khi kết thúc, hãy tự kiểm tra:

```text
1. python api.py
        ↓
2. Open http://127.0.0.1:5000
        ↓
3. Dashboard
        ↓
4. Jobs
        ↓
5. Job Detail
        ↓
6. Salary
        ↓
7. Skills
        ↓
8. Locations
        ↓
9. Test API
        ↓
10. pytest
```

Nếu có lỗi:

```text
Identify
    ↓
Fix
    ↓
Run again
    ↓
Verify
```

Không báo "completed" khi vẫn còn lỗi runtime.

---

# 62. FINAL RESPONSE AFTER IMPLEMENTATION

Sau khi hoàn thành implementation, hãy báo cáo ngắn gọn:

```text
PHASE 1 COMPLETED

Implemented:
- Dashboard
- Job Search
- Job Detail
- Salary Analytics
- Skills Analytics
- Location Analytics

Backend:
- Flask
- Pandas
- REST APIs

Frontend:
- HTML
- CSS
- JavaScript
- Chart.js

Testing:
- pytest

Status:
- Application runs successfully
- APIs tested
- Frontend connected
- Responsive UI implemented
```

Sau đó liệt kê:

```text
Files created
Files modified
Tests executed
Known limitations
```

Không tuyên bố hoàn thành nếu chưa kiểm tra runtime.

---

# 63. FUTURE ARCHITECTURE

Phase 1 hiện tại:

```text
CSV
 ↓
Pandas
 ↓
Flask
 ↓
HTML/CSS/JS
 ↓
Chart.js
```

Phase 2 dự kiến:

```text
Job Sources
 ↓
Web Scraper
 ↓
Raw Data
 ↓
ETL
 ↓
Processed Data
 ↓
Flask
 ↓
Dashboard
```

Phase 3:

```text
Sources
 ↓
Airflow
 ↓
ETL
 ↓
PostgreSQL
 ↓
Data Warehouse
 ↓
API
 ↓
Dashboard
```

Phase 4:

```text
Job Data
 ↓
NLP
 ↓
Skill Extraction
 ↓
Job Intelligence
 ↓
Job Matching
 ↓
Career Recommendation
```

Không triển khai các phase này trong Phase 1.

---

# 64. FINAL INSTRUCTION

Hãy coi file này là **Single Source of Truth** cho Phase 1.

Khi có xung đột giữa:

```text
existing code
```

và:

```text
skills.md
```

hãy:

1. Kiểm tra code hiện tại.
2. Giữ lại những phần đang hoạt động.
3. Refactor nếu cần.
4. Đảm bảo cuối cùng đáp ứng Definition of Done.
5. Không phá vỡ chức năng đã có nếu không cần thiết.

Không chỉ tạo file.

Bạn phải:

```text
Analyze
    ↓
Implement
    ↓
Integrate
    ↓
Test
    ↓
Debug
    ↓
Verify
    ↓
Document
```

Mục tiêu cuối cùng là:

> Một Web App Phase 1 hoàn chỉnh, chạy được trên máy local, sử dụng dữ liệu CSV thực tế, cung cấp REST API bằng Flask, hiển thị Dashboard và Analytics bằng HTML/CSS/JavaScript/Chart.js, có khả năng tìm kiếm Job và xem Job Detail, đồng thời có code đủ sạch để tiếp tục phát triển sang Phase 2 — Data Engineering Pipeline.
