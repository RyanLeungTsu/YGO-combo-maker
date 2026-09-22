from pydantic import BaseModel
from typing import Any
from datetime import datetime

class DeckCreate(BaseModel):
    name: str
    main: list[Any]
    extra: list[Any]
    side: list[Any]

class DeckResponse(DeckCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True