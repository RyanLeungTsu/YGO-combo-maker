from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.card import CardCache
from app.services.ygopro_client import fetch_cards_from_ygoprodeck

async def search_cards(db: Session, filters: dict, offset: int, num: int) -> dict:
    # build YGOPRODeck query params from our filters
    params = {"num": num, "offset": offset}
    if filters.get("name"):
        params["fname"] = filters["name"]
    if filters.get("type"):
        params["type"] = filters["type"]
    if filters.get("attribute"):
        params["attribute"] = filters["attribute"]
    if filters.get("level"):
        params["level"] = filters["level"]
    if filters.get("atk"):
        params["atk"] = f"gte{filters['atk']}"
    if filters.get("def"):
        params["def"] = f"gte{filters['def']}"
    if filters.get("archetype"):
        params["archetype"] = filters["archetype"]

    # fetches live and upsert into cache (simple, correct)
    raw_cards = await fetch_cards_from_ygoprodeck(params)

    for raw in raw_cards:
        existing = db.get(CardCache, raw["id"])
        if not existing:
            db.add(CardCache(
                id=raw["id"],
                name=raw["name"],
                type=raw["type"],
                frame_type=raw.get("frameType", ""),
                description=raw.get("desc", ""),
                race=raw.get("race", ""),
                archetype=raw.get("archetype"),
                atk=raw.get("atk"),
                def_=raw.get("def"),
                level=raw.get("level"),
                attribute=raw.get("attribute"),
                card_images=raw.get("card_images", []),
            ))
    db.commit()

    return {
        "cards": raw_cards,
        "hasMore": len(raw_cards) == num,
    }