from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from routers.auth import get_current_admin

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(get_current_admin)])


@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı.")
    return crud.create_user(db, user)


@router.get("/", response_model=list[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)


@router.get("/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")
    return db_user


@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")
    return crud.update_user(db, user_id, user)


@router.put("/{user_id}/role")
def update_user_role(user_id: int, new_role: str, db: Session = Depends(get_db)):
    if new_role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Geçersiz rol. 'admin' veya 'user' olmalı.")
    user = crud.update_user_role(db, user_id, new_role)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")
    return {"message": f"{user.name} kullanıcısının rolü '{new_role}' olarak güncellendi."}


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.delete_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")
    return {"message": f"{db_user.name} kullanıcısı başarıyla silindi."} 





