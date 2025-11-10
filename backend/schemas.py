from datetime import datetime
from typing import Optional
from pydantic import BaseModel

# KATEGORİ SCHEMAS

class CategoryBase(BaseModel):
    name:str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True



# ÜRÜN SCHEMAS
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
    id:int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
