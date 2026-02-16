from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum


class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    VENDOR = "vendor"
    BUYER = "buyer"


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class RFQStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    REVISED = "revised"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    address = Column(Text, default="")
    date_of_birth = Column(String(20), default="")
    age = Column(Integer, default=0)
    id_proof_path = Column(String(500), default="")
    official_doc_path = Column(String(500), default="")
    generated_id = Column(String(20), unique=True, nullable=False)
    approval_status = Column(SQLEnum(ApprovalStatus), default=ApprovalStatus.APPROVED)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="vendor", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="buyer", cascade="all, delete-orphan")
    rfqs_sent = relationship("RFQ", foreign_keys="RFQ.buyer_id", back_populates="buyer", cascade="all, delete-orphan")
    rfqs_received = relationship("RFQ", foreign_keys="RFQ.vendor_id", back_populates="vendor", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="buyer", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0)
    discount = Column(Float, default=0.0)
    category = Column(String(100), default="General")
    image_url = Column(String(500), default="")
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("User", back_populates="products")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    rfqs = relationship("RFQ", back_populates="product", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)

    buyer = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")


class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    expected_price = Column(Float, nullable=False)
    vendor_price = Column(Float, default=0.0)
    vendor_notes = Column(Text, default="")
    status = Column(SQLEnum(RFQStatus), default=RFQStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="rfqs_sent")
    vendor = relationship("User", foreign_keys=[vendor_id], back_populates="rfqs_received")
    product = relationship("Product", back_populates="rfqs")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    commission_amount = Column(Float, default=0.0)
    shipping_address = Column(Text, nullable=False)
    shipping_city = Column(String(100), default="")
    shipping_zip = Column(String(20), default="")
    payment_method = Column(String(50), default="card")
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.CONFIRMED)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    buyer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    rfq = relationship("RFQ")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")


class GlobalSettings(Base):
    __tablename__ = "global_settings"

    id = Column(Integer, primary_key=True, index=True)
    commission_percentage = Column(Float, default=5.0)
