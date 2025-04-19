import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel
from pydantic import field_serializer

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product

class UUIDModel(SQLModel):
    """Base model with UUID primary key."""
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
    )
    
    @field_serializer('id')
    def serialize_id(self, id: uuid.UUID):
        return str(id)

class TimestampModel(SQLModel):
    """Base model with created_at and updated_at fields."""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    @field_serializer('created_at')
    def serialize_created_at(self, dt: datetime):
        return dt.isoformat() if dt else None
        
    @field_serializer('updated_at')
    def serialize_updated_at(self, dt: datetime):
        return dt.isoformat() if dt else None 