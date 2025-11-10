from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud, database


# Router oluşturuyoruz - bu dosya /categories URL'lerini yönetecek
router = APIRouter(prefix="/categories", tags=["Categories"])

# TÜM KATEGORİLERİ GETİR
@router.get("/",response_model=list[schemas.CategoryResponse])
def get_all_categories(db:Session = Depends(database.get_db)):
    """Tüm kategorileri getirir"""
    categories = crud.get_categories(db)
    return categories

# YENİ KATEGORİ EKLE
@router.post("/", response_model=schemas.CategoryResponse)
def add_category(category: schemas.CategoryCreate, db:Session = Depends(database.get_db)):
    """Yeni bir kategori ekler."""
    db_category = crud.create_category(db,category)
    return db_category

# KATEGORİ GÜNCELLE
@router.put("/{category_id}", response_model=schemas.CategoryResponse)
def update_category(category_id: int, update_data: schemas.CategoryCreate, db:Session = Depends(database.get_db)):
   """Belirtilen ID'deki kategoriyi günceller."""

   category = crud.update_category(db, category_id, update_data)
   if not category:
       raise HTTPException(status_code=404, detail="Kategori bulunamadı.")
   return category

# KATEGORİ SİL
@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(database.get_db)):
    """Belirtilen ID'deki kategoriyi siler."""
    deleted = crud.delete_category(db, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı")
    return {"message":"Kategori başarıyla silindi."}

