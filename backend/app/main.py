import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db.session import Base, engine
from app.routers import cards, banlist_route

os.makedirs("static/card_images", exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Yu-Gi-Oh Deck & Combo Maker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(cards.router)
app.include_router(banlist_route.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
