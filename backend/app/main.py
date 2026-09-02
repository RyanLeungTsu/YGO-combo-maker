from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import Base, engine
from app.routers import cards

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Yu-Gi-Oh Deck & Combo Maker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cards.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
