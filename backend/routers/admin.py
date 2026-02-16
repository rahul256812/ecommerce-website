from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserRole, ApprovalStatus, Product, GlobalSettings
from schemas import CommissionUpdate
from auth import require_role

router = APIRouter(prefix="/api/admin", tags=["admin"])


# --- Admin: Manage Users ---
@router.get("/vendors")
async def list_vendors(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    vendors = db.query(User).filter(User.role == UserRole.VENDOR).all()
    return [_user_dict(v) for v in vendors]


@router.get("/buyers")
async def list_buyers(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    buyers = db.query(User).filter(User.role == UserRole.BUYER).all()
    return [_user_dict(b) for b in buyers]


@router.get("/admins")
async def list_admins(
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
    return [_user_dict(a) for a in admins]


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Cannot delete super admin")
    if current_user.role == UserRole.ADMIN and user.role == UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Cannot delete fellow admin")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# --- Super Admin: Approve/Reject Admins ---
@router.put("/approve/{user_id}")
async def approve_admin(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.role == UserRole.ADMIN).first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin not found")
    user.approval_status = ApprovalStatus.APPROVED
    db.commit()
    return {"message": "Admin approved"}


@router.put("/reject/{user_id}")
async def reject_admin(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.role == UserRole.ADMIN).first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin not found")
    user.approval_status = ApprovalStatus.REJECTED
    db.commit()
    return {"message": "Admin rejected"}


# --- Super Admin: Products ---
@router.get("/products")
async def all_products(
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "quantity": p.quantity,
            "discount": p.discount,
            "category": p.category,
            "vendor_id": p.vendor_id,
            "vendor_name": p.vendor.name if p.vendor else "",
            "created_at": str(p.created_at),
        }
        for p in products
    ]


# --- Super Admin: Commission ---
@router.get("/commission")
async def get_commission(
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    settings = db.query(GlobalSettings).first()
    if not settings:
        settings = GlobalSettings(commission_percentage=5.0)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {"commission_percentage": settings.commission_percentage}


@router.put("/commission")
async def set_commission(
    update: CommissionUpdate,
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    settings = db.query(GlobalSettings).first()
    if not settings:
        settings = GlobalSettings(commission_percentage=update.commission_percentage)
        db.add(settings)
    else:
        settings.commission_percentage = update.commission_percentage
    db.commit()
    return {"message": "Commission updated", "commission_percentage": update.commission_percentage}


# --- All Users (for super admin) ---
@router.get("/all-users")
async def all_users(
    current_user: User = Depends(require_role(UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    users = db.query(User).filter(User.role != UserRole.SUPER_ADMIN).order_by(User.created_at.desc()).all()
    return [_user_dict(u) for u in users]


def _user_dict(u: User) -> dict:
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role.value,
        "generated_id": u.generated_id,
        "address": u.address,
        "date_of_birth": u.date_of_birth,
        "approval_status": u.approval_status.value,
        "created_at": str(u.created_at),
    }
