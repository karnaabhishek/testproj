from datetime import date, time

from fastapi import APIRouter, Depends, Form, HTTPException, status

from sqlalchemy.orm import Session
from apps.apis.v1.users.filter_sort import (
    Filter,
    Sort,
)
from apps.common.enum import AppointmentStatusEnum, RoleEnum
from apps.config.db.conn import get_db
from apps.core.models.users import StudentAppointment
from apps.core.schemas.appointment import (
    AppointmentRequestSchema,
    AppointmentFilterSchema,
    AppointmentResponseSchemaTotal,
)

from apps.security.auth import jwt_service


router = APIRouter(prefix="/appointment", tags=["appointment"])


@router.get("/get", response_model=AppointmentResponseSchemaTotal)
def list_appointment(
    offset: int = 0,
    limit: int = 10,
    appointment_filter_params: AppointmentFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    """API to list appointments

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        appointment_filter_params (AppointmentFilterSchema, optional):
                student_id,
                instructor_id,
                appointment_date,
                status,
                sort,
                order.
            Defaults to Depends().
        db (Session, optional): CTX database. Defaults to Depends(get_db).
    """
    query = db.query(StudentAppointment)

    filter_params = {
        "student_id": appointment_filter_params.student_id,
        "instructor_id": appointment_filter_params.instructor_id,
        "appointment_date": appointment_filter_params.appointment_date,
        "status": appointment_filter_params.status,
    }

    query = Filter().filter_appointment(query, **filter_params)
    query = Sort().sorting_appointment(
        query=query,
        sort=appointment_filter_params.sort,
        order=appointment_filter_params.order,
    )

    total_count = query.with_entities(StudentAppointment.id).count()

    response = {
        "total_count": total_count,
        "appointments": query.offset(offset).limit(limit).all(),
    }

    return response


@router.post("/post")
def request_appointment(
    appointment_data: AppointmentRequestSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to request appointment

    Args:
        appointment_data (AppointmentRequestSchema, optional):
                appointment_date,
                start_time,
                end_time.
            Defaults to Depends().
        current_user (Any, optional): Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 406, You have a pending request
        HTTPException: 500, Error occurred while creating the appointment

    Returns:
        message: Appointment request sent successfully
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    appointment_exists = (
        db.query(StudentAppointment)
        .filter(StudentAppointment.student_id == user.id)
        .first()
    )

    if appointment_exists is not None:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="you have a pending request",
        )

    try:
        db_item_data = appointment_data.model_dump(exclude_unset=True)
        db_item_data["student_id"] = user.id
        appointment_db = StudentAppointment(**db_item_data)
        db.add(appointment_db)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while creating the appointment",
        ) from e

    return {"message": "Appointment request sent successfully"}


@router.put("/update")
def update_appointment(
    appointment_date: date = Form(None),
    start_time: time = Form(None),
    end_time: time = Form(None),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API for updating appointment

    Args:
        appointment_date (date, optional): Date of the appointment. Defaults to Form(None).
        start_time (time, optional): Appointment starting time. Defaults to Form(None).
        end_time (time, optional): Appointment end time. Defaults to Form(None).
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, You do not have any appointment
        HTTPException: 500, Error occurred while deleting the appointment

    Returns:
        message: Appointment updated successfully
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    appointment_db = (
        db.query(StudentAppointment)
        .filter(StudentAppointment.student_id == user.id)
        .first()
    )

    if appointment_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You do not have any appointment",
        )

    try:
        if appointment_date is not None:
            setattr(appointment_db, "appointment_date", appointment_date)

        if start_time is not None:
            setattr(appointment_db, "start_time", start_time)

        if end_time is not None:
            setattr(appointment_db, "end_time", end_time)

        db.add(appointment_db)
        db.commit()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while updating the appointment",
        ) from e

    return {"message": "Appointment updated successfully"}


@router.delete("/delete/{pk}")
def delete_appointment(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to delete appointment

    Args:
        pk (int): appointment id
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Appointment not found
        HTTPException: 500, Error occurred while deleting the appointment

    Returns:
        appointment_db: Deleted appointment
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    appointment_db = (
        db.query(StudentAppointment).filter(StudentAppointment.id == pk).first()
    )

    if appointment_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    # if appointment_db.student_id != user.id:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="You are not authorized to delete this appointment"
    #     )

    try:
        db.delete(appointment_db)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while deleting the appointment",
        ) from e

    return appointment_db


@router.put("/approve")
def approve_appointment(
    pk: int,
    instructor_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to aprrove appointment

    Args:
        pk (int): appointment id
        instructor_id (int): instructor id
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX datbase. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Appointment not found
        HTTPException: 401, You are not authorized to approve this appointment
        HTTPException: 500, Error occurred while approving the appointment

    Returns:
        message: Appointment approved successfully
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    appointment_db = (
        db.query(StudentAppointment).filter(StudentAppointment.id == pk).first()
    )

    if appointment_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if appointment_db.status is AppointmentStatusEnum.CONFIRMED:
        return {"message": "Appointment already approved"}

    if user.role is RoleEnum.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to approve this appointment",
        )

    try:
        setattr(appointment_db, "status", AppointmentStatusEnum.CONFIRMED)
        setattr(appointment_db, "instructor_id", instructor_id)
        db.add(appointment_db)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while approving the appointment",
        ) from e

    return {"message": "Appointment approved successfully"}
