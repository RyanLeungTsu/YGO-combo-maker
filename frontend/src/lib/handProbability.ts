function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

export function probabilityAtLeast(
  deckSize: number,
  successesInDeck: number,
  handSize: number,
  successesWanted: number
): number {
  let probFewer = 0;
  for (let k = 0; k < successesWanted; k++) {
    probFewer +=
      (combinations(successesInDeck, k) * combinations(deckSize - successesInDeck, handSize - k)) /
      combinations(deckSize, handSize);
  }
  return Math.max(0, Math.min(1, 1 - probFewer));
}