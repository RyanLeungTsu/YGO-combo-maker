from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.combo import Combo
from app.schemas.combo import ComboCreate, ComboResponse

router = APIRouter(prefix="/api/combos", tags=["combos"])

@router.get("", response_model=list[ComboResponse])
def list_combos(db: Session = Depends(get_db)):
    return db.query(Combo).order_by(Combo.updated_at.desc()).all()

@router.post("", response_model=ComboResponse)
def create_combo(payload: ComboCreate, db: Session = Depends(get_db)):
    combo = Combo(
        name=payload.name,
        steps=payload.steps,
        linked_deck=payload.linked_deck,
        linked_end_board=payload.linked_end_board,
    )
    db.add(combo)
    db.commit()
    db.refresh(combo)
    return combo

@router.put("/{combo_id}", response_model=ComboResponse)
def update_combo(combo_id: int, payload: ComboCreate, db: Session = Depends(get_db)):
    combo = db.get(Combo, combo_id)
    if not combo:
        raise HTTPException(status_code=404, detail="Combo not found")
    combo.name = payload.name
    combo.steps = payload.steps
    combo.linked_deck = payload.linked_deck
    combo.linked_end_board = payload.linked_end_board
    db.commit()
    db.refresh(combo)
    return combo

@router.delete("/{combo_id}")
def delete_combo(combo_id: int, db: Session = Depends(get_db)):
    combo = db.get(Combo, combo_id)
    if not combo:
        raise HTTPException(status_code=404, detail="Combo not found")
    db.delete(combo)
    db.commit()
    return {"deleted": True}