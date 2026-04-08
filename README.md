# 📦 InvenTrack – Inventory Management System

Hệ thống quản lý hàng tồn kho với **FastAPI** (backend) + **React + Vite** (frontend).

---

## 🗂️ Cấu trúc dự án

```
inventory-system/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── database.py              # SQLite + SQLAlchemy setup
│   ├── models.py                # ORM models
│   ├── schemas.py               # Pydantic schemas
│   ├── auth.py                  # JWT auth + role guards
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py              # /auth/login, /auth/me
│       ├── users.py             # /users CRUD (Admin only)
│       ├── products.py          # /products CRUD + filters + alerts
│       └── transactions.py      # /transactions + export CSV/Excel
└── frontend/
    ├── src/
    │   ├── api.js               # Axios API layer
    │   ├── App.jsx              # Routes
    │   ├── index.css            # Global styles
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   └── Layout.jsx       # Sidebar layout
    │   └── pages/
    │       ├── LoginPage.jsx
    │       ├── Dashboard.jsx
    │       ├── ProductsPage.jsx
    │       ├── StockInPage.jsx
    │       ├── StockOutPage.jsx
    │       ├── TransactionsPage.jsx
    │       ├── AlertsPage.jsx
    │       └── UsersPage.jsx
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Backend | **FastAPI** 0.115 |
| Database | **SQLite** + **SQLAlchemy** 2.0 |
| Auth | **JWT** (python-jose) + **bcrypt** (passlib) |
| Export | **pandas** + **openpyxl** |
| Frontend | **React 18** + **Vite** |
| Routing | **react-router-dom** v6 |
| HTTP | **axios** |
| UI Icons | **lucide-react** |
| Date | **date-fns** |
| Toast | **react-hot-toast** |

---

## 🚀 Cài đặt & Chạy

### 1. Backend

```bash
cd backend

# Tạo virtual environment (khuyến nghị)
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# Cài thư viện
pip install -r requirements.txt

# Chạy server
uvicorn main:app --reload --port 8000
```

> API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

> App: http://localhost:5173

---

## 👤 Tài khoản mặc định

| Tài khoản | Mật khẩu | Vai trò |
|-----------|----------|---------|
| `admin` | `admin123` | Admin |
| `manager` | `manager123` | Manager |
| `staff` | `staff123` | Staff |

---

## 🔐 Phân quyền

| Chức năng | Admin | Manager | Staff |
|-----------|:-----:|:-------:|:-----:|
| Xem sản phẩm | ✅ | ✅ | ✅ |
| Thêm/Sửa/Xóa sản phẩm | ✅ | ✅ | ❌ |
| Nhập kho | ✅ | ✅ | ✅ |
| Xuất kho | ✅ | ✅ | ✅ |
| Xem lịch sử giao dịch | ✅ | ✅ | ❌ |
| Export CSV/Excel | ✅ | ✅ | ❌ |
| Xem cảnh báo | ✅ | ✅ | ✅ |
| Quản lý người dùng | ✅ | ❌ | ❌ |

---

## 📡 API Endpoints

### Auth
- `POST /auth/login` – Đăng nhập
- `GET /auth/me` – Thông tin user hiện tại

### Users (Admin only)
- `GET /users` – Danh sách users
- `POST /users` – Tạo user
- `PUT /users/{id}` – Cập nhật user
- `DELETE /users/{id}` – Xóa user

### Products
- `GET /products` – Danh sách (hỗ trợ filter: search, category, low_stock, expiring_soon, import_date)
- `POST /products` – Thêm sản phẩm
- `PUT /products/{id}` – Cập nhật
- `DELETE /products/{id}` – Xóa
- `GET /products/categories` – Danh sách danh mục
- `GET /products/alerts` – Cảnh báo tồn kho & hết hạn

### Transactions
- `GET /transactions` – Lịch sử (filter: product_id, type, date_from, date_to)
- `POST /transactions` – Tạo giao dịch nhập/xuất
- `GET /transactions/export/csv` – Export CSV
- `GET /transactions/export/excel` – Export Excel

---

## ✅ Tính năng đã triển khai (MVP)

- [x] Đăng nhập / JWT Auth / Role-based access
- [x] Quản lý người dùng (CRUD, phân quyền)
- [x] Quản lý sản phẩm (CRUD đầy đủ)
- [x] Nhập kho – tự động cộng tồn, ghi lịch sử
- [x] Xuất kho – kiểm tra tồn trước khi trừ, ghi lịch sử
- [x] Tìm kiếm & lọc sản phẩm (tên, danh mục, tồn kho, ngày nhập, sắp hết hạn)
- [x] Cảnh báo sắp hết hàng & sắp/đã hết hạn
- [x] Lịch sử giao dịch với filter ngày & loại
- [x] Export CSV & Excel
- [x] Dashboard tổng quan
- [x] Giao diện responsive với sidebar
