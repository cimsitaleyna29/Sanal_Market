from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routers import categories, products

# Tabloları oluştur (eğer yoksa)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sanal Market")

# CORS ayarı (frontend için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları dahil et (endpointler)
app.include_router(categories.router)
app.include_router(products.router)


@app.get("/")
def home():
    return {"message": "Sanal Market API çalışıyor 🚀"}

# Sunucu başlatma
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

    