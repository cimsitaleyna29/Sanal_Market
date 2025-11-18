from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("/")
def get_basic_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_products = db.query(models.Product).count()
    total_categories = db.query(models.Category).count()

    return {
        "users": total_users,
        "products": total_products,
        "categories": total_categories,
    }


# /auth ( giriş, token işlemleri)
# /users ( kullanıcı işlemleri)
# /products ( ürün işlemleri )
# /categories (kategoriler)
# /stats ( dashboard istatistikleri)





