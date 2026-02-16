from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import RFQ, RFQStatus, Product, User, UserRole
from schemas import RFQCreate, RFQRespond
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/rfq", tags=["rfq"])


@router.post("/")
async def create_rfq(
    rfq: RFQCreate,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == rfq.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    new_rfq = RFQ(
        buyer_id=current_user.id,
        vendor_id=rfq.vendor_id,
        product_id=rfq.product_id,
        quantity=rfq.quantity,
        expected_price=rfq.expected_price,
    )
    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)
    return {"message": "RFQ submitted successfully", "rfq_id": new_rfq.id}


@router.get("/buyer")
async def buyer_rfqs(
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    rfqs = db.query(RFQ).filter(RFQ.buyer_id == current_user.id).order_by(RFQ.created_at.desc()).all()
    return [_rfq_to_dict(r) for r in rfqs]


@router.get("/vendor")
async def vendor_rfqs(
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
):
    rfqs = db.query(RFQ).filter(RFQ.vendor_id == current_user.id).order_by(RFQ.created_at.desc()).all()
    return [_rfq_to_dict(r) for r in rfqs]


@router.put("/{rfq_id}/respond")
async def respond_rfq(
    rfq_id: int,
    resp: RFQRespond,
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id, RFQ.vendor_id == current_user.id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    if resp.status not in ["accepted", "rejected", "revised"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    rfq.vendor_price = resp.vendor_price
    rfq.vendor_notes = resp.vendor_notes
    rfq.status = RFQStatus(resp.status)
    db.commit()
    return {"message": f"RFQ {resp.status}"}


@router.put("/{rfq_id}/buyer-action")
async def buyer_rfq_action(
    rfq_id: int,
    action: str,
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id, RFQ.buyer_id == current_user.id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    if action == "accept":
        rfq.status = RFQStatus.ACCEPTED
    elif action == "decline":
        rfq.status = RFQStatus.REJECTED
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    db.commit()
    return {"message": f"RFQ {action}ed"}


@router.get("/all")
async def all_rfqs(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    rfqs = db.query(RFQ).order_by(RFQ.created_at.desc()).all()
    return [_rfq_to_dict(r) for r in rfqs]


def _rfq_to_dict(r: RFQ) -> dict:
    return {
        "id": r.id,
        "buyer_id": r.buyer_id,
        "buyer_name": r.buyer.name if r.buyer else "",
        "vendor_id": r.vendor_id,
        "vendor_name": r.vendor.name if r.vendor else "",
        "product_id": r.product_id,
        "product_name": r.product.name if r.product else "",
        "quantity": r.quantity,
        "expected_price": r.expected_price,
        "vendor_price": r.vendor_price,
        "vendor_notes": r.vendor_notes,
        "status": r.status.value,
        "created_at": str(r.created_at),
        "updated_at": str(r.updated_at),
    }
