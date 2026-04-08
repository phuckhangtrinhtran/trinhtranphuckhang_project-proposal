from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
import models
from auth import get_password_hash
from routers import auth, users, products, transactions

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management System API",
    description="Hệ thống quản lý hàng tồn kho",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(transactions.router)

def seed_admin():
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin:
            admin = models.User(
                username="admin",
                password=get_password_hash("admin123"),
                role=models.RoleEnum.ADMIN
            )
            db.add(admin)

            manager = models.User(
                username="manager",
                password=get_password_hash("manager123"),
                role=models.RoleEnum.MANAGER
            )
            db.add(manager)

            staff = models.User(
                username="staff",
                password=get_password_hash("staff123"),
                role=models.RoleEnum.STAFF
            )
            db.add(staff)
            db.commit()
            print("✅ Seeded default users: admin/admin123, manager/manager123, staff/staff123")
    finally:
        db.close()

seed_admin()

@app.get("/")
def root():
    return {"message": "Inventory Management System API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
