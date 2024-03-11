from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from apps.common.enum import (
    RoleEnum,
    GenderEnum,
    OrderEnum,
    UserSortEnum,
    RoleFilterEnum,
)


class UserCreateSchema(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    password: str
    school: Optional[list[str]] = None
    role: RoleEnum = RoleEnum.STUDENT


class AdminUserCreateSchema(UserCreateSchema):
    cell_phone: Optional[int] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    gender: GenderEnum
    dob: date
    school: Optional[list[str]] = None
    address: Optional[str] = None


class UserResponseSchema(BaseModel):
    id: int
    first_name: Optional[str]
    middle_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr
    is_active: bool
    role: RoleEnum
    created_at: datetime
    updated_at: datetime


class UserResponseSchemaTotal(BaseModel):
    total_count: int
    users: list[UserResponseSchema]


class UserFilterSchema(BaseModel):
    first_name: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    school: Optional[str] = None
    order: OrderEnum = OrderEnum.DESC
    sort: UserSortEnum = UserSortEnum.UPDATED_AT
    role: RoleFilterEnum = RoleFilterEnum.ALL
