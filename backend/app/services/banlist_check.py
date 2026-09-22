import httpx
from sqlalchemy.orm import Session
from app.models.banlist import BanlistEntry

BANLIST_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
MASTERDUEL_BANLIST_URL = "https://api.ygoprodeck.com/banlist/?list=Master+Duel"


async def refresh_banlist(db: Session, format: str) -> int:
    db.query(BanlistEntry).filter(BanlistEntry.format == format).delete()
    count = 0

    if format in ("tcg", "ocg"):
        async with httpx.AsyncClient() as client:
            response = await client.get(BANLIST_URL, params={"banlist": format}, timeout=15.0)
            response.raise_for_status()
            data = response.json().get("data", [])

        ban_key = f"ban_{format}"
        for card in data:
            status = card.get("banlist_info", {}).get(ban_key)
            if status:
                db.add(BanlistEntry(card_id=card["id"], card_name=card["name"], status=status, format=format))
                count += 1

    elif format == "masterduel":
        async with httpx.AsyncClient() as client:
            response = await client.get(MASTERDUEL_BANLIST_URL, timeout=15.0)
            response.raise_for_status()
            data = response.json()
        for entry in data:
            if entry.get("id") and entry.get("ban_status"):
                db.add(BanlistEntry(
                    card_id=entry["id"], card_name=entry.get("name", ""),
                    status=entry["ban_status"], format=format,
                ))
                count += 1

    db.commit()
    return count

def get_current_banlist(db: Session, format: str) -> list[dict]:
    entries = db.query(BanlistEntry).filter(BanlistEntry.format == format).all()
    return [{"cardId": e.card_id, "name": e.card_name, "status": e.status} for e in entries]