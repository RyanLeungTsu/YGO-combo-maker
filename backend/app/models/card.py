from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime, timezone
from app.db.session import Base

class CardCache(Base):
    __tablename__ = "card_cache"

    # using YGOpro ids
    id = Column(Integer, primary_key=True)  
    name = Column(String, index=True)
    type = Column(String, index=True)
    frame_type = Column(String)
    description = Column(String)
    race = Column(String)
    archetype = Column(String, nullable=True)
    atk = Column(Integer, nullable=True)
    def_ = Column("def", Integer, nullable=True)
    level = Column(Integer, nullable=True)
    attribute = Column(String, nullable=True)
    # stores raw image_url as JSON
    card_images = Column(JSON)  
    cached_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))