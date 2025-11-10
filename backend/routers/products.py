from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud, database

# Router: /products ile başlayan tüm URL'leri yönetecek
router = APIRouter(prefix="/products",tags=["Products"])

# TÜM ÜRÜNLERİ GETİR
@router.get("/", response_model=list[schemas.ProductResponse])
def get_all_products(db: Session = Depends(database.get_db)):
    """Tüm ürünleri getirir."""
    products = crud.get_products(db)
    return products


# YENİ ÜRÜN EKLE
@router.post("/",response_model=schemas.ProductResponse)
def add_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    """Yeni bir ürün ekler."""
    db_product = crud.create_product(db, product)
    return db_product

# ÜRÜN GÜNCELLE
@router.put("/{product_id}",response_model=schemas.ProductResponse)
def update_product(product_id: int, update_data: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    """Belirtilen ID'deki ürünü günceller."""
    product = crud.update_product(db, product_id, update_data)
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı.")
    return product

# ÜRÜN SİL
@router.delete("/{product_id}")
def delete_product(product_id: int, db:Session = Depends(database.get_db)):
    """Belirtilen ID'deki ürünü siler."""
    deleted = crud.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return {"message": "Ürün başarıyla silindi."}


