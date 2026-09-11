from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from app.db.session import Base


class BanlistEntry(Base):
    __tablename__ = "banlist_entries"

    card_id = Column(Integer, primary_key=True)
    card_name = Column(String, index=True)
    # "Banned", "Limited", "Semi-Limited" for ygo per Konami banlist
    status = Column(String)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
