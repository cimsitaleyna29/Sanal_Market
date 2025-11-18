import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func

import models
from database import Base, SessionLocal, engine
from routers import auth, categories, products, salary, stats, users
from security import get_password_hash, verify_password

DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@sanalmarket.com").lower()
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin123!")
DEFAULT_ADMIN_NAME = os.getenv("DEFAULT_ADMIN_NAME", "Sanal")
DEFAULT_ADMIN_SURNAME = os.getenv("DEFAULT_ADMIN_SURNAME", "Market")


def ensure_default_admin():
    db = SessionLocal()
    try:
        target_email = DEFAULT_ADMIN_EMAIL
        admin = (
            db.query(models.User)
            .filter(func.lower(models.User.email) == target_email)
            .order_by(models.User.id.desc())
            .first()
        )

        hashed_password = get_password_hash(DEFAULT_ADMIN_PASSWORD)

        if not admin:
            db.add(
                models.User(
                    name=DEFAULT_ADMIN_NAME,
                    surname=DEFAULT_ADMIN_SURNAME,
                    email=target_email,
                    phone=None,
                    password_hash=hashed_password,
                    role="admin",
                    is_active=True,
                )
            )
            db.commit()
            return

        admin.email = target_email
        admin.name = DEFAULT_ADMIN_NAME
        admin.surname = DEFAULT_ADMIN_SURNAME
        admin.role = "admin"
        admin.is_active = True

        try:
            needs_update = not verify_password(DEFAULT_ADMIN_PASSWORD, admin.password_hash)
        except ValueError:
            needs_update = True

        if needs_update:
            admin.password_hash = hashed_password

        db.commit()
    finally:
        db.close()


Base.metadata.create_all(bind=engine)
ensure_default_admin()

app = FastAPI(title="Sanal Market")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(salary.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(stats.router)


@app.get("/")
def home():
    return {"message": "Sanal Market API calisiyor"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
