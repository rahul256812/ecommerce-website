from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import CartItem, Product, User, UserRole
from schemas import CartAdd, CartUpdate
from auth import require_role

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.get("/")
async def get_cart(
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    items = db.query(CartItem).filter(CartItem.buyer_id == current_user.id).all()
    return [
        {
            "id": ci.id,
            "product_id": ci.product_id,
            "product_name": ci.product.name,
            "product_price": ci.product.price,
            "product_discount": ci.product.discount,
            "product_image": ci.product.image_url,
            "vendor_name": ci.product.vendor.name if ci.product.vendor else "",
            "quantity": ci.quantity,
            "available_qty": ci.product.quantity,
        }
        for ci in items
    ]


@router.post("/")
async def add_to_cart(
    item: CartAdd,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(CartItem.buyer_id == current_user.id, CartItem.product_id == item.product_id)
        .first()
    )
    if existing:
        existing.quantity += item.quantity
    else:
        ci = CartItem(buyer_id=current_user.id, product_id=item.product_id, quantity=item.quantity)
        db.add(ci)
    db.commit()
    return {"message": "Added to cart"}


@router.put("/{item_id}")
async def update_cart_item(
    item_id: int,
    update: CartUpdate,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    ci = db.query(CartItem).filter(CartItem.id == item_id, CartItem.buyer_id == current_user.id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if update.quantity <= 0:
        db.delete(ci)
    else:
        ci.quantity = update.quantity
    db.commit()
    return {"message": "Cart updated"}


@router.delete("/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    ci = db.query(CartItem).filter(CartItem.id == item_id, CartItem.buyer_id == current_user.id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(ci)
    db.commit()
    return {"message": "Removed from cart"}
