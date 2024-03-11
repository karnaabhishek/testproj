from sqlalchemy import Boolean, Column, String, Float, Text
from sqlalchemy.orm import relationship

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base
from apps.core.schemas import user


class Organization(Base, TimeStampMixin):
    __tablename__ = "organizations"

    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    zipcode = Column(String, nullable=True)

    # instructor = relationship("User", back_populates="organization", secondary="instructor_organizations")


class School(Base, TimeStampMixin):

    __tablename__ = "schools"

    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=False)
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    zipcode = Column(String, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)

    users = relationship("Users", back_populates="school", secondary="user_schools")
