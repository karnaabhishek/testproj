from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SQLAlchemyEnum

from apps.config.db.base import Base
from apps.common.model import TimeStampMixin

from apps.common.enum import TransactionMethodEnum


class Transaction(Base, TimeStampMixin):
    __tablename__ = "transactions"

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("Users", backref="transactions", lazy="joined")

    amount = Column(Float, nullable=False)
    discount = Column(Float, nullable=True)
    method = Column(
        SQLAlchemyEnum(TransactionMethodEnum),
        nullable=True,
    )  # nullable is True because of unclear requirement

    location = Column(String, nullable=True)

    date_charged = Column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )  # pylint: disable=not-callable

    refund = Column(Boolean, nullable=True, default=False)


class Refund(Base, TimeStampMixin):
    __tablename__ = "refunds"

    transaction_id = Column(Integer, ForeignKey("transactions.id"))

    user_id = Column(Integer, ForeignKey("users.id"))

    refund_amount = Column(Float, nullable=False)
    refund_date = Column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )  # pylint: disable=not-callable
    reason = Column(String, nullable=False)
