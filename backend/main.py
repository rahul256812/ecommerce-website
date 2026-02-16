from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, SessionLocal
from models import User, UserRole, ApprovalStatus, GlobalSettings
from auth import hash_password
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="B2B E-commerce Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Register routers
from routers import users, products, cart, rfq, orders, admin

app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(rfq.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.on_event("startup")
async def seed_data():
    db = SessionLocal()
    try:
        # Create Super Admin if not exists
        sa = db.query(User).filter(User.role == UserRole.SUPER_ADMIN).first()
        if not sa:
            sa = User(
                name="Super Admin",
                email="superadmin@b2b.com",
                password_hash=hash_password("admin123"),
                role=UserRole.SUPER_ADMIN,
                generated_id="SA-00000001",
                approval_status=ApprovalStatus.APPROVED,
            )
            db.add(sa)

        # Create default settings if not exists
        settings = db.query(GlobalSettings).first()
        if not settings:
            db.add(GlobalSettings(commission_percentage=5.0))

        db.commit()
    finally:
        db.close()


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
