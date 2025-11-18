from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from routers.auth import get_current_admin

router = APIRouter(prefix="/users", tags=["Salary"], dependencies=[Depends(get_current_admin)])


@router.post("/{user_id}/salary", response_model=dict)
def set_user_salary(user_id: int, salary_data: schemas.SalaryUpdate, db: Session = Depends(get_db)):
    crud.create_or_update_user_details(db, user_id, salary_data.salary)
    return {"message": f"Kullanıcı ID {user_id} için maaş bilgisi {salary_data.salary} TL olarak kaydedildi."}


@router.get("/{user_id}/salary", response_model=schemas.UserDetailsResponse | None)
def get_user_salary(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_details(db, user_id)
