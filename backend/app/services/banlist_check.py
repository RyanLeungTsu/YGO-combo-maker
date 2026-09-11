import httpx
from sqlalchemy.orm import Session
from app.models.banlist import BanlistEntry

BANLIST_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"


async def refresh_banlist(db: Session) -> int:
    # fetches every currently-restricted card and replaces the local table with it
    params = {"banlist": "tcg"}
    async with httpx.AsyncClient() as client:
        response = await client.get(BANLIST_URL, params=params, timeout=15.0)
        response.raise_for_status()
        data = response.json().get("data", [])

    db.query(BanlistEntry).delete()

    count = 0
    for card in data:
        ban_info = card.get("banlist_info", {})
        status = ban_info.get("ban_tcg")
        if status:
            db.add(
                BanlistEntry(card_id=card["id"], card_name=card["name"], status=status)
            )
            count += 1

    db.commit()
    return count


def get_current_banlist(db: Session) -> list[dict]:
    entries = db.query(BanlistEntry).all()
    return [
        {"cardId": e.card_id, "name": e.card_name, "status": e.status} for e in entries
    ]
