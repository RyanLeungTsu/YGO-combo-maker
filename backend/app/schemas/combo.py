from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ComboCreate(BaseModel):
    name: str
    steps: list[Any]
    linked_deck: dict[str, Any] | None = None
    linked_end_board: dict[str, Any] | None = None

class ComboResponse(ComboCreate):
    id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PublishRequest(BaseModel):
    is_published: bool