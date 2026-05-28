"""Project model"""
from sqlalchemy import Column, String, DateTime, Text, Numeric, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid
from datetime import datetime
import enum


class ProjectStatus(str, enum.Enum):
    EVALUATION = "EVALUATION"
    QUOTED = "QUOTED"
    APPROVED = "APPROVED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    ON_HOLD = "ON_HOLD"


class ProjectType(str, enum.Enum):
    SANEAMIENTO = "SANEAMIENTO"
    INDEPENDIZACION = "INDEPENDIZACION"
    DISENO = "DISENO"
    CONSTRUCCION = "CONSTRUCCION"
    LEVANTAMIENTO = "LEVANTAMIENTO"
    COMPRAVENTA = "COMPRAVENTA"


class Priority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class Project(Base):
    """Project model"""
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String, nullable=False, default="SANEAMIENTO")
    status = Column(String, nullable=False, default="EVALUATION")
    priority = Column(String, nullable=False, default="MEDIUM")

    # Timeline
    startDate = Column(DateTime, nullable=True)
    endDate = Column(DateTime, nullable=True)
    deadline = Column(DateTime, nullable=True)

    # Financial
    budget = Column(Numeric(12, 2), nullable=True)
    quotedAmount = Column(Numeric(12, 2), nullable=True)

    # Relations (simplified)
    clientId = Column(String, nullable=False)
    creatorId = Column(String, nullable=False)
    assigneeId = Column(String, nullable=True)

    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Project {self.code}: {self.title}>"
