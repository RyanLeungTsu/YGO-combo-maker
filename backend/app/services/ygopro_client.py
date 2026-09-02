import httpx

BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"


async def fetch_cards_from_ygoprodeck(params: dict) -> list[dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params, timeout=10.0)
        if response.status_code == 400:
            # YGOPRODeck returns 400 for "no results"
            return []
        response.raise_for_status()
        data = response.json()
        return data.get("data", [])
