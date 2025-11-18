from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="user")
    is_active = Column(Boolean, default=True)

    details = relationship("UserDetails", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserDetails(Base):
    __tablename__ = "userdetails"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    salary = Column(Float, nullable=True)

    user = relationship("User", back_populates="details")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    brand = Column(String(100), nullable=True)
    description = Column(String(500), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    discount_rate = Column(Numeric(5, 2), default=0.00)
    final_price = Column(Numeric(10, 2), nullable=True)
    stock = Column(Integer, default=0)
    unit = Column(String(50), default="adet")
    barcode = Column(String(50), nullable=True)
    expiration_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))
    category = relationship("Category", back_populates="products")



