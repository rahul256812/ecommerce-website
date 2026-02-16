from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Order, OrderItem, OrderStatus, CartItem, Product, RFQ, RFQStatus, User, UserRole, GlobalSettings
from schemas import OrderCreate
from auth import require_role, get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/from-cart")
async def create_order_from_cart(
    order: OrderCreate,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    cart_items = db.query(CartItem).filter(CartItem.buyer_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    settings = db.query(GlobalSettings).first()
    commission_pct = settings.commission_percentage if settings else 5.0

    total = 0.0
    order_items = []
    for ci in cart_items:
        price = ci.product.price * (1 - ci.product.discount / 100)
        item_total = price * ci.quantity
        total += item_total
        order_items.append(OrderItem(product_id=ci.product_id, quantity=ci.quantity, price=price))
        ci.product.quantity = max(0, ci.product.quantity - ci.quantity)

    commission = total * commission_pct / 100

    new_order = Order(
        buyer_id=current_user.id,
        total_amount=total,
        commission_amount=commission,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_zip=order.shipping_zip,
        payment_method=order.payment_method,
        status=OrderStatus.CONFIRMED,
    )
    db.add(new_order)
    db.flush()

    for oi in order_items:
        oi.order_id = new_order.id
        db.add(oi)

    for ci in cart_items:
        db.delete(ci)

    db.commit()
    db.refresh(new_order)
    return {"message": "Order placed successfully", "order_id": new_order.id}


@router.post("/from-rfq")
async def create_order_from_rfq(
    order: OrderCreate,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    if not order.rfq_id:
        raise HTTPException(status_code=400, detail="RFQ ID required")

    rfq = db.query(RFQ).filter(RFQ.id == order.rfq_id, RFQ.buyer_id == current_user.id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    if rfq.status != RFQStatus.ACCEPTED:
        raise HTTPException(status_code=400, detail="RFQ not accepted")

    settings = db.query(GlobalSettings).first()
    commission_pct = settings.commission_percentage if settings else 5.0

    price = rfq.vendor_price if rfq.vendor_price > 0 else rfq.expected_price
    total = price * rfq.quantity
    commission = total * commission_pct / 100

    product = db.query(Product).filter(Product.id == rfq.product_id).first()
    if product:
        product.quantity = max(0, product.quantity - rfq.quantity)

    new_order = Order(
        buyer_id=current_user.id,
        total_amount=total,
        commission_amount=commission,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_zip=order.shipping_zip,
        payment_method=order.payment_method,
        status=OrderStatus.CONFIRMED,
        rfq_id=rfq.id,
    )
    db.add(new_order)
    db.flush()

    oi = OrderItem(order_id=new_order.id, product_id=rfq.product_id, quantity=rfq.quantity, price=price)
    db.add(oi)
    db.commit()
    db.refresh(new_order)
    return {"message": "Order placed from RFQ", "order_id": new_order.id}


@router.get("/my")
async def my_orders(
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    orders = db.query(Order).filter(Order.buyer_id == current_user.id).order_by(Order.created_at.desc()).all()
    return [_order_dict(o) for o in orders]


@router.get("/all")
async def all_orders(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [_order_dict(o) for o in orders]


def _order_dict(o: Order) -> dict:
    return {
        "id": o.id,
        "buyer_id": o.buyer_id,
        "buyer_name": o.buyer.name if o.buyer else "",
        "total_amount": o.total_amount,
        "commission_amount": o.commission_amount,
        "shipping_address": o.shipping_address,
        "shipping_city": o.shipping_city,
        "shipping_zip": o.shipping_zip,
        "payment_method": o.payment_method,
        "status": o.status.value,
        "rfq_id": o.rfq_id,
        "created_at": str(o.created_at),
        "items": [
            {
                "product_id": i.product_id,
                "product_name": i.product.name if i.product else "",
                "quantity": i.quantity,
                "price": i.price,
            }
            for i in o.items
        ],
    }
