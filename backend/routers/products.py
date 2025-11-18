from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import database
import schemas
from routers.auth import get_current_admin

router = APIRouter(
    prefix="/products",
    tags=["Products"],
    dependencies=[Depends(get_current_admin)],
)


@router.get("/", response_model=list[schemas.ProductResponse])
def get_all_products(db: Session = Depends(database.get_db)):
    return crud.get_products(db)


@router.post("/", response_model=schemas.ProductResponse)
def add_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    return crud.create_product(db, product)


@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    update_data: schemas.ProductCreate,
    db: Session = Depends(database.get_db),
):
    product = crud.update_product(db, product_id, update_data)
    if not product:
        raise HTTPException(status_code=404, detail="Urun bulunamadi.")
    return product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(database.get_db)):
    deleted = crud.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Urun bulunamadi.")
    return {"message": "Urun basariyla silindi."} 





