from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from apps.common.enum import OrderEnum, TransactionMethodEnum, TransactionSortEnum


class TransactionBase(BaseModel):
    amount: Optional[float] = None
    discount: Optional[float] = None
    method: TransactionMethodEnum = TransactionMethodEnum.CASH
    location: Optional[str] = None


class TransactionFilterSchema(TransactionBase):
    transaction_id: Optional[int] = None
    user_id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: TransactionSortEnum = TransactionSortEnum.DATE_CHARGED
    is_deleted: bool = False
    date_charged: Optional[datetime] = None


class TransactionCreate(TransactionBase):
    user_id: Optional[int] = None


class TransactionUpdate(TransactionBase):
    id: int
    user_id: Optional[int] = None
    date_charged: Optional[datetime] = None
    refund: Optional[bool] = None


class TransactionCreateResponse(TransactionBase):
    id: int
    user_id: Optional[int] = None
    date_charged: Optional[datetime] = None
    refund: Optional[bool] = None


class TransactionUserResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None


class TransactionResponseSchema(TransactionBase):
    id: int
    user_id: Optional[int] = None
    date_charged: Optional[datetime] = None
    refund: Optional[bool] = None
    is_deleted: bool = False
    user: TransactionUserResponse


class TransactionResponseSchemaTotal(BaseModel):
    total: int
    transactions: list[TransactionResponseSchema]


class TransactionUserResponseSchema(TransactionBase):
    id: int
    date_charged: Optional[datetime] = None
    refund: Optional[bool] = None
