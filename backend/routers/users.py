from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserRole, ApprovalStatus
from schemas import SignupRequest, LoginRequest, TokenResponse, ProfileUpdate
from auth import hash_password, verify_password, create_access_token, get_current_user
import uuid
import os
import shutil

router = APIRouter(prefix="/api/users", tags=["users"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_id(role: str) -> str:
    short = uuid.uuid4().hex[:8].upper()
    prefix = {
        "vendor": "VND",
        "buyer": "BYR", 
        "admin": "ADM",
        "super_admin": "SA"
    }
    return f"{prefix.get(role, 'USR')}-{short}"

@router.post("/signup")
async def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    address: str = Form(""),
    date_of_birth: str = Form(""),
    age: int = Form(0),
    id_proof: UploadFile = File(None),
    official_doc: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if role not in ["vendor", "buyer", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    id_proof_path = ""
    if id_proof and id_proof.filename:
        fname = f"{uuid.uuid4().hex}_{id_proof.filename}"
        fpath = os.path.join(UPLOAD_DIR, fname)
        with open(fpath, "wb") as f:
            shutil.copyfileobj(id_proof.file, f)
        id_proof_path = f"/uploads/{fname}"
    
    official_doc_path = ""
    if official_doc and official_doc.filename:
        fname = f"{uuid.uuid4().hex}_{official_doc.filename}"
        fpath = os.path.join(UPLOAD_DIR, fname)
        with open(fpath, "wb") as f:
            shutil.copyfileobj(official_doc.file, f)
        official_doc_path = f"/uploads/{fname}"
    
    approval = ApprovalStatus.APPROVED
    if role == "admin":
        approval = ApprovalStatus.PENDING
    
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole(role),
        address=address,
        date_of_birth=date_of_birth,
        age=age,
        id_proof_path=id_proof_path,
        official_doc_path=official_doc_path,
        generated_id=generate_id(role),
        approval_status=approval,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    msg = "Account created successfully."
    if role == "admin":
        msg = "Account created. Pending Super Admin approval."
    
    return {"message": msg, "user_id": user.generated_id}

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.role.value != req.role:
        raise HTTPException(status_code=403, detail=f"This account is not a {req.role}")
    
    if user.approval_status == ApprovalStatus.PENDING:
        raise HTTPException(status_code=403, detail="Account pending approval")
    
    if user.approval_status == ApprovalStatus.REJECTED:
        raise HTTPException(status_code=403, detail="Account has been rejected")
    
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    
    return TokenResponse(
        access_token=token,
        user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value,
            "generated_id": user.generated_id,
            "address": user.address,
            "date_of_birth": user.date_of_birth,
            "approval_status": user.approval_status.value,
        }
    )

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value,
        "generated_id": current_user.generated_id,
        "address": current_user.address,
        "date_of_birth": current_user.date_of_birth,
        "age": current_user.age,
        "approval_status": current_user.approval_status.value,
        "id_proof_path": current_user.id_proof_path,
        "official_doc_path": current_user.official_doc_path,
        "monthly_budget": current_user.monthly_budget,
    }

@router.get("/me")
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value,
        "generated_id": current_user.generated_id,
        "address": current_user.address,
        "date_of_birth": current_user.date_of_birth,
        "age": current_user.age,
        "approval_status": current_user.approval_status.value,
        "id_proof_path": current_user.id_proof_path,
        "official_doc_path": current_user.official_doc_path,
        "monthly_budget": current_user.monthly_budget,
    }

@router.put("/me")
async def update_current_user_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile.name:
        current_user.name = profile.name
    if profile.address:
        current_user.address = profile.address
    if profile.date_of_birth:
        current_user.date_of_birth = profile.date_of_birth
    if profile.age is not None:
        current_user.age = profile.age
    if profile.monthly_budget is not None:
        current_user.monthly_budget = profile.monthly_budget
    
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}