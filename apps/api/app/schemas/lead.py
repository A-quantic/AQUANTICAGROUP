"""Lead Pydantic schemas"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class LeadBase(BaseModel):
    firstName: str
    lastName: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    serviceType: str
    message: Optional[str] = None


class LeadCreate(LeadBase):
    pass


class LeadResponse(BaseModel):
    id: str
    status: str
    message: str
    createdAt: Optional[datetime] = None
    
    class Config:
        from_attributes = True
