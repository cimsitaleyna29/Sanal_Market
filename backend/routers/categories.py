from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import database
import schemas
from routers.auth import get_current_admin

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
    dependencies=[Depends(get_current_admin)],
)


@router.get("/", response_model=list[schemas.CategoryResponse])
def get_all_categories(db: Session = Depends(database.get_db)):
    categories = crud.get_categories(db)
    return categories


@router.post("/", response_model=schemas.CategoryResponse)
def add_category(category: schemas.CategoryCreate, db: Session = Depends(database.get_db)):
    db_category = crud.create_category(db, category)
    return db_category


@router.put("/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
    category_id: int,
    update_data: schemas.CategoryCreate,
    db: Session = Depends(database.get_db),
):
    category = crud.update_category(db, category_id, update_data)
    if not category:
        raise HTTPException(status_code=404, detail="Kategori bulunamadi.")
    return category



@router.delete("/{category_id}")
def delete_category(category_id: int, db:Session = Depends(database.get_db)):
    deleted = crud.delete_category(db, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı.")
    return {"message":"Kategori basariyla silindi"}




