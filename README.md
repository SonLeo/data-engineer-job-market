# 🇻🇳 Vietnam Data Engineer Job Market

Web application phân tích thị trường việc làm **Data Engineer tại Việt Nam**, được xây dựng nhằm thu thập, xử lý, lưu trữ trên **IBM Db2 Cloud**, phân tích chuyên sâu và trực quan hóa dữ liệu tuyển dụng.

Dự án được phát triển theo từng giai đoạn, bắt đầu từ **Phase 1 — MVP** (tích hợp IBM Db2, phân tích dữ liệu tuyển dụng và trực quan hóa giao diện tương tác) và có định hướng mở rộng thành nền tảng **Data Engineer Job Market Intelligence** hoàn chỉnh (Phase 2 automated crawlers, Phase 3 ETL/ELT pipelines với Airflow & dbt).

---

## 🎯 Project Goal

Hệ thống cung cấp giải pháp toàn diện giúp ứng viên, nhà tuyển dụng và cộng đồng kỹ sư dữ liệu giải quyết các câu hỏi trọng tâm:

- Việt Nam hiện có bao nhiêu cơ hội việc làm Data Engineer đang mở?
- Những doanh nghiệp, tập đoàn công nghệ & ngân hàng nào đang tuyển dụng tích cực nhất?
- Phân bổ việc làm giữa các thành phố lớn (TP.HCM, Hà Nội, Đà Nẵng, v.v.) ra sao?
- Mức lương thực tế phổ biến của Data Engineer ở từng cấp bậc (Junior / Mid / Senior)?
- Kinh nghiệm làm việc tác động như thế nào đến thu nhập và đãi ngộ?
- Những công nghệ & kỹ năng nào (SQL, Python, Spark, AWS, Airflow, Kafka, DBT...) được săn đón nhiều nhất?
- Những cặp kỹ năng nào thường xuyên được yêu cầu song hành cùng nhau?
- Xu hướng tăng trưởng thị trường tuyển dụng Data Engineer theo thời gian?

---

## 🚀 Phase 1 — MVP Core Modules

Phiên bản MVP bao gồm 6 phân hệ cốt lõi:

```
Dashboard  ──>  Job Search  ──>  Job Detail
    │
    ├───> Salary Analytics
    ├───> Skills Analytics
    └───> Location Analytics
```

1. **Dashboard Tổng Quan**: Báo cáo KPI toàn cảnh thị trường: Tổng số việc làm, Số công ty tuyển dụng, Lương trung vị (Median), Lương trung bình, Mức lương cao nhất, Việc làm mới nhất, Tỷ lệ tuyển Remote, và Biểu đồ xu hướng tuyển dụng theo thời gian.
2. **Tìm Kiếm Việc Làm (Job Search)**: Tìm kiếm đa tiêu chí, kết hợp lọc theo từ khóa, thành phố, cấp bậc kinh nghiệm (Junior/Mid/Senior), khoảng lương, hình thức làm việc (Remote/On-site) cùng tính năng phân trang linh hoạt.
3. **Chi Tiết Tin Tuyển Dụng (Job Detail)**: Hiển thị đầy đủ thông tin chi tiết: Chức danh, Doanh nghiệp, Địa điểm, Mức lương, Yêu cầu kinh nghiệm, Mô tả công việc, Bộ kỹ năng trích xuất, Nguồn tuyển dụng và Đường dẫn ứng tuyển gốc.
4. **Phân Tích Mức Lương (Salary Analytics)**: Biểu đồ phân bổ dải lương, tương quan lương theo cấp độ thâm niên, mức lương trung bình theo từng khu vực và theo từng kỹ năng công nghệ.
5. **Phân Tích Kỹ Năng (Skills Analytics)**: Xếp hạng Top 20 kỹ năng Data Engineer có nhu cầu tuyển dụng cao nhất cùng biểu đồ ma trận các cặp kỹ năng thường xuyên kết hợp cùng nhau.
6. **Phân Tích Khu Vực Tuyển Dụng (Location Analytics)**: Bản đồ nhiệt và biểu đồ tỷ trọng phân bổ việc làm, mức lương bình quân tại các trung tâm kinh tế trọng điểm.

---

## 🏗️ Kiến Trúc Hệ Thống (Project Architecture)

```
                                ┌─────────────────────────┐
                                │   IBM Db2 Cloud (bludb) │
                                └────────────┬────────────┘
                                             │
                                             │ SQL / ibm_db
                                             ▼
┌─────────────────────────┐           ┌──────────────┐
│       jobs.csv          │ ────────> │  src/db.py   │
└─────────────────────────┘           └──────┬───────┘
  (Generated / Crawled                       │
   tại thư mục data/)                        ▼
                                      ┌──────────────┐
                                      │  src/api.py  │ (Flask App & REST API)
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

## 📁 Cấu Trúc Thư Mục (Project Structure)

Mã nguồn dự án được tổ chức khoa học, tách biệt rõ ràng giữa mã nguồn backend (`src/`), dữ liệu (`data/`), kịch bản cơ sở dữ liệu (`sql/`), giao diện (`templates/`, `static/`) và kiểm thử tự động (`tests/`):

```text
data-engineer-job-market/
│
├── src/                            # Thư mục mã nguồn chính (Application Source Code)
│   ├── __init__.py                 # Đánh dấu package Python
│   ├── api.py                      # Flask Web Application & REST API endpoints
│   ├── db.py                       # Quản lý kết nối, DDL và nạp dữ liệu IBM Db2 Cloud
│   └── generate_data.py            # Generator sinh 10,000 dữ liệu việc làm thực tế phục vụ phân tích
│
├── sql/                            # Các kịch bản SQL dành riêng cho IBM Db2 Cloud
│   ├── create_tables.sql           # DDL: Tạo bảng JOBS và các index tối ưu hóa truy vấn
│   ├── insert_sample_data.sql      # DML: Dữ liệu mẫu khởi tạo ban đầu
│   └── analytics.sql               # Các câu truy vấn phân tích tổng hợp (Aggregation & Window Functions)
│
├── data/                           # Thư mục chứa dữ liệu
│   └── jobs.csv                    # Tập dữ liệu việc làm (10,000 bản ghi)
│
├── templates/                      # Giao diện HTML (Jinja2 Templates)
│   ├── index.html                  # Trang Dashboard tổng quan
│   ├── jobs.html                   # Trang Tìm kiếm & Lọc việc làm
│   ├── job-detail.html             # Trang Chi tiết tin tuyển dụng
│   ├── salary.html                 # Trang Phân tích lương
│   ├── skills.html                 # Trang Phân tích kỹ năng
│   └── locations.html              # Trang Phân tích địa điểm
│
├── static/                         # Tài nguyên tĩnh giao diện (Assets)
│   ├── css/                        # Hệ thống stylesheet giao diện hiện đại, responsive
│   │   ├── style.css               # Global Design System (Tokens, Typography, Reset, Layout)
│   │   ├── dashboard.css           # Style cho trang Dashboard
│   │   ├── jobs.css                # Style cho trang Jobs & Job Detail
│   │   └── analytics.css           # Style cho các trang Analytics & Charts
│   └── js/                         # JavaScript xử lý tương tác & biểu đồ
│       ├── api.js                  # Client API wrapper giao tiếp với Backend
│       ├── dashboard.js            # Logic hiển thị số liệu Dashboard
│       ├── jobs.js                 # Logic tìm kiếm, lọc & phân trang việc làm
│       ├── job-detail.js           # Logic hiển thị chi tiết tin tuyển dụng
│       ├── salary.js               # Render biểu đồ phân tích lương
│       ├── skills.js               # Render biểu đồ phân tích kỹ năng
│       ├── locations.js            # Render biểu đồ phân tích khu vực
│       └── charts.js               # Cấu hình chung cho Chart.js
│
├── tests/                          # Bộ kiểm thử tự động (Automated Test Suite)
│   ├── test_api.py                 # Kiểm thử tích hợp các endpoint REST API Flask
│   └── test_db.py                  # Kiểm thử kết nối và hàm xử lý IBM Db2 Cloud
│
├── .env                            # Biến môi trường cục bộ (Chứa thông tin kết nối DB2)
├── .env.example                    # File mẫu biến môi trường
├── .gitignore                      # Cấu hình bỏ qua các file không cần commit lên Git
├── Procfile                        # File cấu hình khởi chạy triển khai (Gunicorn WSGI)
├── requirements.txt                # Danh sách thư viện Python cần thiết
└── README.md                       # Tài liệu hướng dẫn dự án
```

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

### Cơ Sở Dữ Liệu & Lưu Trữ
- **IBM Db2 on Cloud**: Enterprise Cloud Relational Database / Data Warehouse.
- **ibm_db** & **ibm_db_dbi**: Driver kết nối chuyên dụng đạt hiệu năng cao cho IBM Db2 trên Python.
- **SQL DDL & DML**: Thiết kế bảng với kiểu dữ liệu tối ưu và đánh chỉ mục (Index) theo các trường lọc chính.

### Backend & Xử Lý Dữ Liệu
- **Python 3.12+**
- **Flask 3.x**: Microframework phục vụ Web giao diện và cung cấp RESTful API.
- **Pandas & NumPy**: Xử lý dữ liệu dạng bảng, tính toán thống kê phân vị, chuẩn hóa chuỗi và trích xuất kỹ năng.
- **python-dotenv**: Quản lý cấu hình biến môi trường an toàn.

### Frontend & Trực Quan Hóa
- **HTML5 & CSS3**: Giao diện thiết kế thủ công theo phong cách hiện đại (Glassmorphism, Dark Accents, mượt mà trên Mobile & Desktop).
- **JavaScript (Vanilla ES6+)**: Fetch API bất đồng bộ, render dữ liệu động không tải lại trang.
- **Chart.js**: Trực quan hóa biểu đồ cột, thanh ngang, đường biểu diễn và ma trận tương quan.

### Testing & Deployment
- **pytest**: Kiểm thử tự động đơn vị và tích hợp.
- **Gunicorn**: Web Server Gateway Interface (WSGI) phục vụ môi trường Production.

---

## ⚙️ Hướng Dẫn Cài Đặt & Cấu Hình

### 1. Khởi tạo môi trường ảo và cài đặt thư viện

```bash
# Clone repository
git clone https://github.com/your-username/data-engineer-job-market.git
cd data-engineer-job-market

# Tạo virtual environment
python -m venv venv

# Kích hoạt venv trên Windows:
venv\Scripts\activate

# Kích hoạt venv trên Linux / macOS:
source venv/bin/activate

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt
```

### 2. Cấu hình biến môi trường kết nối IBM Db2 (`.env`)

Sao chép file `.env.example` thành `.env` và cập nhật thông tin chứng thực từ tài khoản IBM Cloud của bạn:

```env
DB2_DATABASE=bludb
DB2_HOSTNAME=1bbf73c5-d84a-4bb0-85b9-ab1a4348f4a4.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud
DB2_PORT=32286
DB2_PROTOCOL=TCPIP
DB2_UID=mgy69782
DB2_PWD=your_db2_password_here
DB2_SECURITY=SSL

FLASK_APP=src/api.py
FLASK_ENV=development
```

*(Lưu ý: Nếu chưa cấu hình `.env`, hệ thống có cơ chế dự phòng tự động đọc cấu hình kết nối từ `data.json` hoặc sử dụng tập tin `data/jobs.csv` local).*

### 3. Sinh dữ liệu mẫu (Data Generator)

Để tạo mới hoặc làm mới tập dữ liệu mô phỏng 10,000 tin tuyển dụng Data Engineer chân thực:

```bash
python src/generate_data.py
```
*Tập tin CSV sẽ tự động được ghi vào `data/jobs.csv`.*

### 4. Khởi tạo Database & Nạp dữ liệu lên IBM Db2 Cloud

Sử dụng module `src/db.py` với các tùy chọn dòng lệnh:

```bash
# Thực hiện toàn bộ quy trình: Kiểm tra kết nối -> Tạo bảng (DDL) -> Đẩy 10,000 bản ghi lên DB2 -> Kiểm tra xác thực
python src/db.py --all

# Hoặc thực hiện riêng rẽ từng thao tác:
python src/db.py --init          # Đọc sql/create_tables.sql và khởi tạo bảng JOBS
python src/db.py --import-csv   # Nạp toàn bộ dữ liệu từ data/jobs.csv vào DB2
python src/db.py --verify       # Đếm tổng số bản ghi hiện có trong database
```

---

## ▶️ Khởi Chạy Ứng Dụng (Run Application)

Khởi động Flask Web Server:

```bash
python src/api.py
```

Mở trình duyệt và truy cập:
```
http://127.0.0.1:5000
```

---

## 🔌 Danh Sách REST API Endpoints

Hệ thống cung cấp đầy đủ các RESTful API phục vụ frontend và các ứng dụng tích hợp bên ngoài:

| Phương thức | Đường dẫn Endpoint | Mô tả chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra tình trạng server và kết nối tới IBM Db2 Cloud |
| `POST` | `/api/reload` | Tải lại (reload) dữ liệu mới nhất từ IBM Db2 Cloud vào bộ nhớ |
| `GET` | `/api/dashboard` | Lấy số liệu thống kê KPI tổng quan và biểu đồ xu hướng thị trường |
| `GET` | `/api/jobs` | Lấy danh sách việc làm (hỗ trợ phân trang `page`, `page_size`, lọc theo từ khóa, thành phố, kinh nghiệm, khoảng lương) |
| `GET` | `/api/jobs/<job_id>` | Lấy thông tin chi tiết đầy đủ của một tin tuyển dụng theo ID |
| `GET` | `/api/analytics/salary` | Phân tích phân bổ mức lương, lương theo cấp bậc, địa điểm và kỹ năng |
| `GET` | `/api/analytics/skills` | Thống kê Top 20 kỹ năng được yêu cầu nhiều nhất và các cặp kỹ năng đồng xuất hiện |
| `GET` | `/api/analytics/locations` | Thống kê phân bổ tỷ trọng việc làm và mức lương bình quân theo thành phố |

---

## 🧪 Kiểm Thử Tự Động (Automated Testing)

Chạy bộ kiểm thử tự động toàn diện để kiểm tra tính toàn vẹn của cả tầng cơ sở dữ liệu và API:

```bash
# Chạy toàn bộ test suite
pytest -v

# Chạy riêng kiểm thử API endpoints
pytest tests/test_api.py -v

# Chạy riêng kiểm thử kết nối IBM Db2
pytest tests/test_db.py -v
```

---

## 🚀 Triển Khai (Deployment)

Dự án đã sẵn sàng triển khai trên các nền tảng đám mây (Render, Railway, Heroku, VM, v.v.) qua WSGI Gunicorn:

```bash
gunicorn --chdir src api:app
```
*(Đã được định nghĩa sẵn trong file [Procfile](file:///e:/LEARN/DE/data-engineer-job-market/Procfile))*

---

## 📈 Kế Hoạch Phát Triển (Development Roadmap)

### ✅ Phase 1 — MVP (Completed)
- [x] Thiết lập kiến trúc dự án chuẩn Data Engineering với thư mục `src/`.
- [x] Tích hợp cơ sở dữ liệu đám mây **IBM Db2 Cloud (bludb)**.
- [x] Xây dựng module kết nối, DDL và nạp dữ liệu tự động (`src/db.py`, `sql/`).
- [x] Generator sinh tập dữ liệu 10,000 tin tuyển dụng thực tế (`src/generate_data.py`).
- [x] Xây dựng REST API Backend với Flask & Pandas (`src/api.py`).
- [x] Thiết kế giao diện Dashboard, Tìm kiếm, Chi tiết việc làm và các trang Phân tích chuyên sâu.
- [x] Automated unit & integration tests với pytest.

### ⏳ Phase 2 — Automated Crawlers & Data Ingestion (Upcoming)
- Thu thập dữ liệu việc làm thực tế định kỳ từ TopDev, ITviec, VietnamWorks, LinkedIn.
- Tự động hóa quá trình Data Cleaning, Normalization và Deduplication.
- Pipeline tự động hóa đẩy các bản ghi mới định kỳ lên IBM Db2 Cloud.

### 🔮 Phase 3 — Modern Data Platform & Orchestration
- Điều phối quy trình (Orchestration) với **Apache Airflow**.
- Biến đổi và kiểm thử mô hình dữ liệu (Data Modeling & Testing) với **dbt**.
- Đóng gói Docker Containerization & thiết lập CI/CD pipeline tự động.

---

## 📄 License

Dự án được xây dựng phục vụ mục đích học tập, nghiên cứu và phát triển kỹ năng Data Engineering.
