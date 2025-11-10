from sqlalchemy.orm import Session
import models,schemas

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

def delete_product(db:Session, product_id: int):
    """Ürünü ID'ye göre siler."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        db.delete(product)
        db.commit()
    return product

