from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    phone: str | None = None


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    role: str | None = None
    is_active: bool | None = None
    password: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserDetailsBase(BaseModel):
    salary: float | None = None


class UserDetailsResponse(UserDetailsBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class SalaryUpdate(BaseModel):
    salary: float


class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    details: UserDetailsResponse | None = None

    class Config:
        orm_mode = True


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    description: Optional[str] = None
    price: float
    discount_rate: Optional[float] = 0.0
    final_price: Optional[float] = None
    stock: Optional[int] = 0
    unit: Optional[str] = "adet"
    barcode: Optional[str] = None
    expiration_date: Optional[datetime] = None
    is_active: Optional[bool] = True
    is_featured: Optional[bool] = False
    image_url: Optional[str] = None
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
