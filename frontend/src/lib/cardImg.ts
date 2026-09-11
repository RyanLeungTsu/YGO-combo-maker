import type { Card } from "../types/card";

const API_BASE = "http://localhost:8000";

export function getCardImageUrl(
  card: Card,
  size: "small" | "full" = "small",
): string {
  if (card.local_image_url) {
    return `${API_BASE}${card.local_image_url}`;
  }
  // fallback for cards not yet cached with an image, or during search results
  return size === "small"
    ? card.card_images[0]?.image_url_small
    : card.card_images[0]?.image_url;
}
