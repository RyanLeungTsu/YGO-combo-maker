from sqlalchemy import Column, Integer, String, JSON, DateTime, Boolean, ForeignKey
from datetime import datetime, timezone
from app.db.session import Base

class Combo(Base):
    __tablename__ = "combos"

    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    name = Column(String, index=True)
    steps = Column(JSON)
    linked_deck = Column(JSON, nullable=True)
    linked_end_board = Column(JSON, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))