from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.deck import Deck
from app.schemas.deck import DeckCreate, DeckResponse

router = APIRouter(prefix="/api/decks", tags=["decks"])

@router.get("", response_model=list[DeckResponse])
def list_decks(db: Session = Depends(get_db)):
    return db.query(Deck).order_by(Deck.updated_at.desc()).all()

@router.post("", response_model=DeckResponse)
def create_deck(payload: DeckCreate, db: Session = Depends(get_db)):
    deck = Deck(name=payload.name, main=payload.main, extra=payload.extra, side=payload.side)
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck

@router.put("/{deck_id}", response_model=DeckResponse)
def update_deck(deck_id: int, payload: DeckCreate, db: Session = Depends(get_db)):
    deck = db.get(Deck, deck_id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    deck.name = payload.name
    deck.main = payload.main
    deck.extra = payload.extra
    deck.side = payload.side
    db.commit()
    db.refresh(deck)
    return deck

@router.delete("/{deck_id}")
def delete_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = db.get(Deck, deck_id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    db.delete(deck)
    db.commit()
    return {"deleted": True}