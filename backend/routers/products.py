from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product, User, UserRole
from schemas import ProductCreate, ProductUpdate
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/")
async def list_products(
    search: str = "",
    category: str = "",
    db: Session = Depends(get_db),
):
    q = db.query(Product)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    if category:
        q = q.filter(Product.category == category)
    products = q.order_by(Product.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "quantity": p.quantity,
            "discount": p.discount,
            "category": p.category,
            "image_url": p.image_url,
            "vendor_id": p.vendor_id,
            "vendor_name": p.vendor.name if p.vendor else "",
            "created_at": str(p.created_at),
        }
        for p in products
    ]


@router.get("/{product_id}")
async def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "price": p.price,
        "quantity": p.quantity,
        "discount": p.discount,
        "category": p.category,
        "image_url": p.image_url,
        "vendor_id": p.vendor_id,
        "vendor_name": p.vendor.name if p.vendor else "",
        "created_at": str(p.created_at),
    }


@router.post("/")
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
):
    p = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        discount=product.discount,
        category=product.category,
        image_url=product.image_url,
        vendor_id=current_user.id,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"message": "Product created", "product_id": p.id}


@router.put("/{product_id}")
async def update_product(
    product_id: int,
    updates: ProductUpdate,
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
):
    p = db.query(Product).filter(Product.id == product_id, Product.vendor_id == current_user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit()
    return {"message": "Product updated"}


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if current_user.role == UserRole.VENDOR and p.vendor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your product")
    if current_user.role not in [UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(p)
    db.commit()
    return {"message": "Product deleted"}


@router.get("/vendor/my")
async def my_products(
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
):
    products = db.query(Product).filter(Product.vendor_id == current_user.id).order_by(Product.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "quantity": p.quantity,
            "discount": p.discount,
            "category": p.category,
            "image_url": p.image_url,
            "created_at": str(p.created_at),
        }
        for p in products
    ]
