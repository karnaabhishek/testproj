from fastapi import Form
from pydantic import BaseModel


class SchoolOrganizationBase(BaseModel):
    name: str
    description: str
    address: str
    latitude: float
    longitude: float
    zipcode: str


class SchoolOrganizationCreate(SchoolOrganizationBase):
    pass


class SchoolUpdateSchema(SchoolOrganizationBase):
    pass


class SchoolResponseSchema(SchoolOrganizationBase):
    id: int

    class Config:
        form_attributes = True


class SchoolResponseSchemaTotal(BaseModel):
    total_count: int
    school: list[SchoolResponseSchema]

    class Config:
        form_attributes = True
