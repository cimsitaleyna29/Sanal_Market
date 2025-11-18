from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models
import schemas
from security import get_password_hash



# category crud

def get_categories(db:Session):
    """Tüm kategorileri getirir."""
    return db.query(models.Category).all()


def create_category(db:Session, category:schemas.CategoryCreate):
    """Yeni kategori oluşturur."""
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, updated_data: schemas.CategoryCreate):
    """kategori güncelleme işlemi"""
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        return None
    
    for key, value in updated_data.model_dump().items():
        setattr(category,key, value)

    db.commit()
    db.refresh(category)
    return category



def delete_category(db:Session, category_id: int):
    """Kategori ID'ye göre silinir."""
    category = db.query(models.Category).filter(models.Category.id== category_id).first()
    if category:
        db.delete(category)
        db.commit()
    return category


# PRODUCT CRUD

def get_products(db:Session):
    """Tüm ürünleri getirir."""
    return db.query(models.Product).all()

def create_product(db:Session, product: schemas.ProductCreate):
    """Yeni ürün ekler"""
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, updated_data: schemas.ProductCreate):
    """Ürün güncelleme işlemi"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return None
    
    for key, value in updated_data.model_dump().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db:Session, product_id: int):
    """Ürünü ID'ye göre siler."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        db.delete(product)
        db.commit()
    return product

# USER CRUD

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name.strip(),
        surname=user.surname.strip(),
        email=user.email.strip().lower(),
        phone=user.phone.strip() if user.phone else None,
        password_hash=get_password_hash(user.password),
        role="user",
        is_active=True,
    )
    db.add(db_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    email = email.strip().lower()
    return db.query(models.User).filter(func.lower(models.User.email) == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session):
    return db.query(models.User).all()


def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    if user.role is not None:
        db_user.role = user.role
    if user.is_active is not None:
        db_user.is_active = user.is_active
    if user.password:
        db_user.password_hash = get_password_hash(user.password)

    db_user.name = user.name.strip()
    db_user.surname = user.surname.strip()
    db_user.email = user.email.strip().lower()
    db_user.phone = user.phone.strip() if user.phone else None

    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    db.delete(db_user)
    db.commit()
    return db_user


def update_user_role(db: Session, user_id: int, new_role: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    db_user.role = new_role
    db.commit()
    db.refresh(db_user)
    return db_user


def create_or_update_user_details(db: Session, user_id: int, salary: float):
    user_details = db.query(models.UserDetails).filter(models.UserDetails.user_id == user_id).first()

    if user_details:
        user_details.salary = salary
    else:
        user_details = models.UserDetails(user_id=user_id, salary=salary)
        db.add(user_details)

    db.commit()
    db.refresh(user_details)
    return user_details


def get_user_details(db: Session, user_id: int):
    return db.query(models.UserDetails).filter(models.UserDetails.user_id == user_id).first()







