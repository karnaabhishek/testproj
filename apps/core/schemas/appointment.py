from datetime import datetime, date, time

from typing import Optional, List
from fastapi import Form

from pydantic import BaseModel, field_validator

from apps.common.enum import (
    AppointmentSortEnum,
    AppointmentStatusEnum,
    OrderEnum,
)


class AppointmentBase(BaseModel):
    student_id: Optional[int] = None
    instructor_id: Optional[int] = None
    appointment_date: Optional[datetime] = None
    status: AppointmentStatusEnum = AppointmentStatusEnum.PENDING


class AppointmentRequestSchema(BaseModel):
    appointment_date: date = Form(...)
    start_time: time = Form(...)
    end_time: time = Form(...)

    @field_validator("appointment_date")
    def appointment_date_validator(cls, v):  # pylint: disable=no-self-argument
        """Validate appointment date"""
        if v < date.today():
            raise ValueError("Appointment date cannot be in the past")
        return v


class AppointmentFilterSchema(AppointmentBase):
    order: OrderEnum = OrderEnum.DESC
    sort: AppointmentSortEnum = AppointmentSortEnum.APPOINTMENT_DATE


class AppointmentResponseSchema(BaseModel):
    id: int
    student_id: Optional[int]
    instructor_id: Optional[int]
    appointment_date: date
    start_time: time
    end_time: time
    status: AppointmentStatusEnum


class AppointmentResponseSchemaTotal(BaseModel):
    total_count: int
    appointments: List[AppointmentResponseSchema]
