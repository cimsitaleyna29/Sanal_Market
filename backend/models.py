from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# 🗂️ KATEGORİ TABLOSU
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)     # örn: “Taze meyve ve sebze ürünleri”
    image_url = Column(String(255), nullable=True)       # kategori görseli

    # İlişki: Bir kategori birden çok ürün içerir
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")



# 🛒 ÜRÜN TABLOSU
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)           # ürün adı (örn: “Süt 1L”)
    brand = Column(String(100), nullable=True)           # marka (örn: “Pınar”)
    description = Column(String(500), nullable=True)     # ürün açıklaması
    price = Column(Numeric(10, 2), nullable=False)       # ürün fiyatı
    discount_rate = Column(Numeric(5, 2), default=0.00)  # indirim oranı (%)
    final_price = Column(Numeric(10, 2), nullable=True)  # indirim sonrası fiyat (otomatik hesaplanabilir)
    stock = Column(Integer, default=0)                   # stok miktarı
    unit = Column(String(50), default="adet")            # ölçü birimi (örn: “kg”, “Litre”)
    barcode = Column(String(50), nullable=True)          # barkod numarası
    expiration_date = Column(DateTime, nullable=True)    # son kullanma tarihi (örn: süt, yoğurt)
    is_active = Column(Boolean, default=True)            # ürün satışta mı?
    is_featured = Column(Boolean, default=False)         # öne çıkan ürün mü (anasayfada göster)
    image_url = Column(String(255), nullable=True)       # ürün görseli (URL)
    created_at = Column(DateTime, default=datetime.utcnow)   # eklenme tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # İlişki: Her ürün bir kategoriye ait
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))
    category = relationship("Category", back_populates="products")
