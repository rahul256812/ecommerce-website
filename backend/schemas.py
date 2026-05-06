from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ---------- Auth ----------
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    address: str = ""
    date_of_birth: str = ""
    age: int = 0


class LoginRequest(BaseModel):
    email: str
    password: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    monthly_budget: Optional[float] = None


# ---------- Products ----------
class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: float
    quantity: int = 0
    discount: float = 0.0
    category: str = "General"
    image_url: str = ""


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    discount: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


# ---------- Cart ----------
class CartAdd(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdate(BaseModel):
    quantity: int


# ---------- RFQ ----------
class RFQCreate(BaseModel):
    product_id: int
    vendor_id: int
    quantity: int
    expected_price: float


class RFQRespond(BaseModel):
    vendor_price: float
    vendor_notes: str = ""
    status: str  # accepted, rejected, revised


# ---------- Orders ----------
class OrderCreate(BaseModel):
    shipping_address: str
    shipping_city: str = ""
    shipping_zip: str = ""
    payment_method: str = "card"
    rfq_id: Optional[int] = None


# ---------- Admin ----------
class CommissionUpdate(BaseModel):
    commission_percentage: float
