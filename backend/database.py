from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# postgresql bağlantı url'i
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:12345@localhost/sanalmarket"

# veritabanı bağlantısını başlatan engine nesnesi
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# her işlem için bir oturum(session) oluşturuyoruz.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Tüm modellerin (tabloların) miras alacağı temel sınıf
Base = declarative_base()


# Bağlantıyı her apı istediğinde açıp sonra kapatacak fonksiyon

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
