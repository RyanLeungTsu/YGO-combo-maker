from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from app.db.session import Base


class BanlistEntry(Base):
    __tablename__ = "banlist_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    card_id = Column(Integer, index=True)
    card_name = Column(String)
    # "Banned", "Limited", "Semi-Limited" for ygo per Konami banlist
    status = Column(String)
    # "tcg", ocg", "masterduel"
    format = Column(String, index=True)  
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


