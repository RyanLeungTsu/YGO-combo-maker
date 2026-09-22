import os
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db.session import Base, engine, SessionLocal
from app.routers import cards, banlist_route, decks, combos
from app.services.banlist_check import refresh_banlist

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
app.include_router(decks.router)
app.include_router(combos.router)

async def run_banlist_refresh():
    db = SessionLocal()
    try:
        for fmt in ("tcg", "ocg"):
            count = await refresh_banlist(db, fmt)
            print(f"Banlist refreshed: {fmt} ({count} entries)")
    except Exception as e:
        print(f"Banlist refresh failed: {e}")
    finally:
        db.close()


async def periodic_banlist_refresh():
    while True:
        await asyncio.sleep(60 * 60 * 24)
        await run_banlist_refresh()


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_banlist_refresh())
    asyncio.create_task(periodic_banlist_refresh())


@app.get("/api/health")
def health():
    return {"status": "ok"}