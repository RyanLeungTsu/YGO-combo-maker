import { useState, useCallback } from "react";
import type { Card } from "../../../types/card";

function shuffle(cards: Card[]): Card[] {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const HAND_SIZE = 5;

export function useShuffledDeck(mainDeck: Card[]) {
  const [hand, setHand] = useState<Card[]>([]);

  const redraw = useCallback(() => {
    setHand(shuffle(mainDeck).slice(0, HAND_SIZE));
  }, [mainDeck]);

  return { hand, redraw };
}