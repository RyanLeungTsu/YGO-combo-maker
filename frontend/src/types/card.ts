// I am using YGOPRODeck's cardinfo.php from their API
export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface Card {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  race: string;
  archetype?: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  card_images: CardImage[];
}

export interface CardSearchFilters {
  name?: string;
  type?: string;
  attribute?: string;
  level?: number;
  atk?: number;
  def?: number;
  archetype?: string;
}

export interface CardSearchResponse {
  data: Card[];
}