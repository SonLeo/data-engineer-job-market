# 🇻🇳 Vietnam Data Engineer Job Market

Web application phân tích thị trường việc làm **Data Engineer tại Việt Nam**, được xây dựng nhằm thu thập, xử lý, lưu trữ trên **IBM Db2 Cloud**, phân tích và trực quan hóa dữ liệu tuyển dụng.

Dự án được phát triển theo từng giai đoạn, bắt đầu từ **Phase 1 — MVP** (tích hợp IBM Db2) và có định hướng mở rộng thành một nền tảng **Data Engineer Job Market Intelligence** hoàn chỉnh (Phase 2 crawler, Phase 3 ETL/ELT pipelines).

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
Cung cấp cái nhìn tổng quan về thị trường việc làm: Total Jobs, Total Companies, Median Salary, Average Salary, Highest Salary, New Jobs, Remote Jobs, và Job Market Trend.

### 2. Job Search
Cho phép người dùng tìm kiếm và lọc việc làm theo: Keyword, Location, Experience (Junior/Mid/Senior), Salary Range, Remote/On-site.

### 3. Job Detail
Hiển thị đầy đủ thông tin chi tiết của một tin tuyển dụng (Job Title, Company, Location, Salary, Experience, Description, Skills, Source, URL, Posted Date).

### 4. Salary Analytics
Phân tích chi tiết mức lương theo: Khoảng lương (Distribution), Cấp bậc kinh nghiệm, Địa điểm làm việc, và Kỹ năng yêu cầu.

### 5. Skills Analytics
Thống kê Top 20 kỹ năng phổ biến nhất và Top cặp kỹ năng thường đi cùng nhau (Skill Combinations).

### 6. Location Analytics
Thống kê phân bổ việc làm và mức lương trung bình theo từng thành phố/khu vực.

---

## 🏗️ Project Architecture

```
                               ┌─────────────────────────┐
                               │   IBM Db2 Cloud (bludb) │
                               └────────────┬────────────┘
                                            │
                                            │ SQL / ibm_db
                                            ▼
┌──────────────┐                     ┌──────────────┐
│   jobs.csv   │ ── (Import/ETL) ──> │    db.py     │
└──────────────┘                     └──────┬───────┘
  (data/ folder                             │
   for Phase 2                              ▼
   crawl raw)                        ┌──────────────┐
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

```text
data-engineer-job-market/
│
├── api.py                  # Flask Web App & REST API endpoints
├── db.py                   # IBM DB2 Cloud connection & migration module
│
├── sql/                    # SQL scripts for IBM DB2
│   ├── create_tables.sql   # DDL script creating JOBS table and indexes
│   ├── insert_sample_data.sql # DML sample data inserts
│   └── analytics.sql       # Analytical SQL queries for DB2 reporting
│
├── data/                   # Data directory (Phase 2 crawlers output)
│   └── jobs.csv            # Base job market dataset
│
├── templates/              # HTML Frontend templates
│   ├── index.html          # Dashboard page
│   ├── jobs.html           # Job search page
│   ├── job-detail.html     # Job detail page
│   ├── salary.html         # Salary analytics page
│   ├── skills.html         # Skills analytics page
│   └── locations.html      # Location analytics page
│
├── static/                 # Static assets (CSS, JS, Fonts)
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   ├── jobs.css
│   │   └── analytics.css
│   └── js/
│       ├── api.js
│       ├── dashboard.js
│       ├── jobs.js
│       ├── job-detail.js
│       ├── salary.js
│       ├── skills.js
│       ├── locations.js
│       └── charts.js
│
├── tests/                  # Automated test suite
│   ├── test_api.py         # Unit & Integration tests for Flask endpoints
│   └── test_db.py          # Unit & Integration tests for IBM DB2 module
│
├── .env                    # Local environment variables (DB2 credentials)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
└── skill.md                # AI coding specification
```

---

## 🛠️ Technology Stack

### Database & Storage
- **IBM Db2 on Cloud** (Warehouse / Transaction DB)
- **ibm_db** (IBM Db2 Python Driver)
- **SQL DDL / DML / Analytical Queries**

### Backend
- **Python 3.12+**
- **Flask 3.x**
- **Pandas & NumPy**
- **python-dotenv**

### Frontend
- **HTML5 & CSS3** (Custom Responsive Design System)
- **JavaScript (ES6+)**
- **Chart.js**

### Testing
- **pytest**

---

## ⚙️ Installation & Database Setup

### 1. Clone repository & Setup Environment

```bash
git clone https://github.com/your-username/data-engineer-job-market.git
cd data-engineer-job-market

# Tạo virtual environment
python -m venv venv

# Kích hoạt venv (Windows)
venv\Scripts\activate

# Kích hoạt venv (Linux/macOS)
source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt
```

### 2. Cấu hình kết nối IBM Db2 (.env)

Tạo file `.env` từ `.env.example` hoặc cấu hình các biến môi trường sau:

```env
DB2_DATABASE=bludb
DB2_HOSTNAME=1bbf73c5-d84a-4bb0-85b9-ab1a4348f4a4.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud
DB2_PORT=32286
DB2_PROTOCOL=TCPIP
DB2_UID=mgy69782
DB2_PWD=unHJxrdF4DgNCbCP
DB2_SECURITY=SSL

FLASK_APP=api.py
FLASK_ENV=development
```

*(Ghi chú: Nếu file `.env` chưa được tạo, hệ thống tự động đọc cấu hình dự phòng từ `data.json`)*.

### 3. Khởi tạo Database & Nạp dữ liệu lên IBM Db2

Sử dụng công cụ `db.py` tích hợp sẵn:

```bash
# Thực hiện toàn bộ quy trình: Kết nối -> Tạo bảng (DDL) -> Đẩy dữ liệu CSV lên DB2 -> Kiểm tra
python db.py --all

# Hoặc thực hiện từng bước riêng lẻ:
python db.py --init          # Tạo bảng jobs từ sql/create_tables.sql
python db.py --import-csv   # Đẩy dữ liệu từ data/jobs.csv vào IBM Db2
python db.py --verify       # Kiểm tra số lượng bản ghi trong database
```

---

## ▶️ Run Application

Khởi động Flask server:

```bash
python api.py
```

Truy cập giao diện Web tại:
```
http://127.0.0.1:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra kết nối IBM Db2 và trạng thái hệ thống |
| `POST` | `/api/reload` | Nạp lại dữ liệu mới nhất từ IBM Db2 vào bộ nhớ |
| `GET` | `/api/dashboard` | Thống kê tổng quan KPI, xu hướng thị trường |
| `GET` | `/api/jobs` | Danh sách việc làm, hỗ trợ tìm kiếm, lọc & phân trang |
| `GET` | `/api/jobs/<job_id>` | Thông tin chi tiết một tin tuyển dụng cụ thể |
| `GET` | `/api/analytics/salary` | Phân tích mức lương theo kinh nghiệm, vị trí, kỹ năng |
| `GET` | `/api/analytics/skills` | Thống kê Top kỹ năng và cặp kỹ năng kết hợp |
| `GET` | `/api/analytics/locations` | Phân bổ việc làm và mức lương theo địa điểm |

---

## 🧪 Run Tests

Chạy toàn bộ 17 automated tests cho cả Database và API:

```bash
pytest -v
```

---

## 📈 Development Roadmap

### Phase 1 — MVP (Completed)
- [x] Thiết lập cấu trúc dự án chuẩn Data Engineering
- [x] Tích hợp cơ sở dữ liệu **IBM Db2 Cloud**
- [x] Tạo module kết nối, DDL và nạp dữ liệu (`db.py`, `sql/`)
- [x] Xây dựng REST API Backend với Flask & Pandas
- [x] Thiết kế giao diện Dashboard, Job Search, Job Detail, Salary, Skills, Location Analytics
- [x] Automated unit & integration tests với pytest

### Phase 2 — Data Crawlers & Auto Ingestion (Upcoming)
- Thu thập dữ liệu việc làm định kỳ từ TopDev, ITviec, VietnamWorks, LinkedIn về thư mục `data/`
- Tự động hóa quá trình Data Cleaning & Deduplication
- Pipeline tự động đẩy các bản ghi mới thu thập được lên IBM Db2 Cloud

### Phase 3 — Data Engineering Platform
- Orchestration với Apache Airflow
- Data transformation & modeling với dbt
- CI/CD & Docker containerization

---

## 📄 License

This project is created for learning, portfolio development, and educational purposes.
