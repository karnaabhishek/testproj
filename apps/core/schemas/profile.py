from datetime import datetime, date
from typing import Optional, List

from pydantic import BaseModel, EmailStr

from apps.common.enum import GenderEnum
from apps.core.schemas.school_organization import SchoolOrganizationBase
from apps.core.schemas.transaction import TransactionUserResponseSchema


class ContactInformationBase(BaseModel):
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[int] = None
    contact_relationship: Optional[str] = None
    contact_type: Optional[str] = None


class ContactInformationCreate(ContactInformationBase):
    pass


class ContactInformationResponse(ContactInformationBase):
    id: int


class ContactInformationUpdateSchema(ContactInformationResponse):
    pass


class ContactInformationResponseSchemaTotal(BaseModel):
    total: int
    contact_information: List[ContactInformationResponse]


class PermitInformationBase(BaseModel):
    permit_number: Optional[str] = None
    permit_issue_date: Optional[datetime] = None
    permit_expiration_date: Optional[datetime] = None
    permit_endorse_by_id: Optional[int] = None
    permit_endorse_date: Optional[datetime] = None


class PermitInformationCreate(PermitInformationBase):
    pass


class PermitInformationResponse(PermitInformationBase):
    id: int


class PermitInformationUpdateSchema(PermitInformationResponse):
    pass


class PickupLocationBase(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None


class PickupLocationCreate(PickupLocationBase):
    pass


class PickupLocationResponse(PickupLocationBase):
    id: int


class PickupLocationResponseSchemaTotal(BaseModel):
    total: int
    pickup_location: List[PickupLocationResponse]


class PickupLocationUpdateSchema(PickupLocationResponse):
    pass


class UserResponse(BaseModel):
    id: int
    email: EmailStr


class ProfileCreate(BaseModel):
    address: str
    contact_information: Optional[ContactInformationCreate] = None
    pickup_location: Optional[List[PickupLocationCreate]] = []
    permit_information: Optional[PermitInformationCreate] = None


class UserResponseSchema(BaseModel):
    id: int
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    role: Optional[str] = None
    transaction: Optional[List[TransactionUserResponseSchema]] = []
    is_verified: Optional[bool] = False
    school: Optional[List[SchoolOrganizationBase]] = []

    class Config:
        orm_mode = True


class ProfileResponseSchema(BaseModel):
    office_note: Optional[str] = None
    cell_phone: Optional[int] = None
    gender: Optional[GenderEnum] = None
    dob: Optional[date] = None
    school: Optional[str] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[int] = None
    certificate_received: Optional[bool] = False


class UserProfileResponse(BaseModel):
    user: UserResponseSchema
    profile: ProfileResponseSchema


class ProfileResponse(ProfileResponseSchema):
    contact_information: Optional[List[ContactInformationResponse]] = []
    pickup_location: Optional[List[PickupLocationResponse]] = []


class UserProfileGetResponse(BaseModel):
    user: UserResponseSchema
    profile: ProfileResponse
