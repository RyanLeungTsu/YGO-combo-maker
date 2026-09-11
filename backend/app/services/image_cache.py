import os
import httpx

IMAGE_DIR = "static/card_images"
os.makedirs(IMAGE_DIR, exist_ok=True)


async def cache_card_image(card_id: int, image_url: str) -> str:
    # downloads an image if not already cached
    filename = f"{card_id}.jpg"
    filepath = os.path.join(IMAGE_DIR, filename)

    if not os.path.exists(filepath):
        async with httpx.AsyncClient() as client:
            response = await client.get(image_url, timeout=15.0)
            response.raise_for_status()
            with open(filepath, "wb") as f:
                f.write(response.content)

    return f"/static/card_images/{filename}"
