from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.card_cache import search_cards

router = APIRouter(prefix="/api/cards", tags=["cards"])

@router.get("/search")
async def search(
    name: str | None = None,
    type: str | None = None,
    attribute: str | None = None,
    level: int | None = None,
    atk: int | None = None,
    def_: int | None = Query(None, alias="def"),
    archetype: str | None = None,
    offset: int = 0,
    num: int = 24,
    db: Session = Depends(get_db),
):
    filters = {
        "name": name, "type": type, "attribute": attribute,
        "level": level, "atk": atk, "def": def_, "archetype": archetype,
    }
    return await search_cards(db, filters, offset, num)