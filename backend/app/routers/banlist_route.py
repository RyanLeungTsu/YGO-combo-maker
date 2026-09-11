from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.banlist_check import refresh_banlist, get_current_banlist

router = APIRouter(prefix="/api/banlist", tags=["banlist"])


@router.get("/current")
def current(db: Session = Depends(get_db)):
    return {"entries": get_current_banlist(db)}


@router.post("/refresh")
async def refresh(db: Session = Depends(get_db)):
    count = await refresh_banlist(db)
    return {"refreshed": count}
