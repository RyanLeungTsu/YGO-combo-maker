from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.combo import Combo
from app.models.user import User
from app.schemas.combo import ComboCreate, ComboResponse, PublishRequest
from app.core.deps import get_current_user

router = APIRouter(prefix="/api/combos", tags=["combos"])

@router.get("", response_model=list[ComboResponse])
def list_combos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Combo).filter(Combo.owner_id == current_user.id).order_by(Combo.updated_at.desc()).all()

@router.post("", response_model=ComboResponse)
def create_combo(payload: ComboCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    combo = Combo(
        name=payload.name,
        steps=payload.steps,
        linked_deck=payload.linked_deck,
        linked_end_board=payload.linked_end_board,
        owner_id=current_user.id,
    )
    db.add(combo)
    db.commit()
    db.refresh(combo)
    return combo

@router.put("/{combo_id}", response_model=ComboResponse)
def update_combo(combo_id: int, payload: ComboCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    combo = db.get(Combo, combo_id)
    if not combo or combo.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Combo not found")
    combo.name = payload.name
    combo.steps = payload.steps
    combo.linked_deck = payload.linked_deck
    combo.linked_end_board = payload.linked_end_board
    db.commit()
    db.refresh(combo)
    return combo

@router.delete("/{combo_id}")
def delete_combo(combo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    combo = db.get(Combo, combo_id)
    if not combo or combo.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Combo not found")
    db.delete(combo)
    db.commit()
    return {"deleted": True}

@router.get("/featured", response_model=list[ComboResponse])
def list_featured(offset: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(Combo)
        .filter(Combo.is_published.is_(True))
        .order_by(Combo.updated_at.desc())
        .offset(offset)
        .limit(min(limit, 50))
        .all()
    )

@router.patch("/{combo_id}/publish", response_model=ComboResponse)
def set_published(
    combo_id: int,
    payload: PublishRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    combo = db.get(Combo, combo_id)
    if not combo or combo.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Combo not found")
    combo.is_published = payload.is_published
    db.commit()
    db.refresh(combo)
    return combo