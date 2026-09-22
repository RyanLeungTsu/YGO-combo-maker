from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime, timezone
from app.db.session import Base

class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    main = Column(JSON)
    extra = Column(JSON)
    side = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))