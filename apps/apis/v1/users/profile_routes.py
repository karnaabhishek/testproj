from datetime import date
from typing import List

from fastapi import APIRouter, Depends, Form, status, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from apps.common.enum import GenderEnum
from apps.common.helpers import get_user_and_profile
from apps.config.db.conn import get_db
from apps.core.models.users import ContactInformation, PickupLocation, Users
from apps.core.schemas.profile import (
    ContactInformationCreate,
    ContactInformationResponse,
    ContactInformationResponseSchemaTotal,
    ContactInformationUpdateSchema,
    PickupLocationCreate,
    PickupLocationResponse,
    PickupLocationResponseSchemaTotal,
    PickupLocationUpdateSchema,
    UserProfileResponse,
    UserProfileGetResponse,
)
from apps.core.models import (
    Profile,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/get", response_model=UserProfileGetResponse)
async def profile(
    current_user=Depends(jwt_service.get_current_user), db: Session = Depends(get_db)
):
    """Router to get user profile

    Args:
        current_user (Any, optional): Get current logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """

    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.user_id == user.id).first()

    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    return {"user": user, "profile": user_profile}


@router.put("/update", response_model=UserProfileResponse)
def update_profile(
    first_name: str = Form(None),
    middle_name: str = Form(None),
    last_name: str = Form(None),
    office_notes: str = Form(None),
    cell_phone: int = Form(None),
    gender: GenderEnum = Form(None),
    dob: date = Form(None),
    school: str = Form(None),
    address: str = Form(None),
    apartment: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    zip_code: int = Form(None),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Router to update user profile

    Args:
        current_user (Any, optional): Get current logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """

    user = jwt_service.get_user(email=current_user.email, db=db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    try:
        if first_name is not None:
            setattr(user, "first_name", first_name)
        if middle_name is not None:
            setattr(user, "middle_name", middle_name)
        if last_name is not None:
            setattr(user, "last_name", last_name)
        if cell_phone is not None:
            setattr(user_profile, "cell_phone", cell_phone)
        if gender is not None:
            setattr(user_profile, "gender", gender)
        if dob is not None:
            setattr(user_profile, "dob", dob)
        if school is not None:
            setattr(user_profile, "school", school)
        if address is not None:
            setattr(user_profile, "address", address)
        if apartment is not None:
            setattr(user_profile, "apartment", apartment)
        if city is not None:
            setattr(user_profile, "city", city)
        if state is not None:
            setattr(user_profile, "state", state)
        if zip_code is not None:
            setattr(user_profile, "zip_code", zip_code)
        if office_notes is not None:
            setattr(user_profile, "office_notes", office_notes)

        db.add(user)
        db.add(user_profile)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"user": user, "profile": user_profile}


@router.post("/pickup/post", response_model=PickupLocationResponse)
def create_pickup_location(
    user_pickup_location: PickupLocationCreate,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to create pickup location

    Args:
        location (str): Pickup location
        current_user (Object, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        success message: Pickup location created successfully
    """

    user = jwt_service.get_user(email=current_user.email, db=db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    # For only one pickup location

    # user_pickup_location_exists = (
    #     db.query(PickupLocation)
    #     .with_entities(PickupLocation.id)
    #     .filter(PickupLocation.name == user_pickup_location.name)
    #     .first()
    # )

    # if user_pickup_location_exists:
    #     return {"message": "Pickup location already exists"}

    try:
        db_item_data = user_pickup_location.model_dump(exclude_unset=True)
        db_item_data["user_id"] = user_profile.id
        pickup_location = PickupLocation(**db_item_data)
        db.add(pickup_location)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return pickup_location


@router.get("/pickup/get", response_model=PickupLocationResponseSchemaTotal)
def get_pickup_location(
    current_user=Depends(jwt_service.get_current_user), db: Session = Depends(get_db)
):
    """API to get pickup location

    Args:
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        PickupLocation: Pickup location
    """
    _, user_profile = get_user_and_profile(current_user, db)

    pickup_location = (
        db.query(PickupLocation).filter(PickupLocation.user_id == user_profile.id).all()
    )

    if not pickup_location:
        return {"message": "No pickup location found"}

    total = (
        db.query(PickupLocation).with_entities(func.count(PickupLocation.id)).scalar()
    )  # pylint: disable=not-callable

    response = {"total": total, "pickup_location": pickup_location}

    return response


@router.put("/pickup/update")
def update_pickup_location(
    pickup_location_update_data: PickupLocationUpdateSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to update pickup location

    Args:
        pickup_location_update_data (PickupLocationUpdateSchema, optional):
                name,
                address,
                apartment,
                city.
        Defaults to Depends().
        current_user (Any, optional):
                Currently logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Pickup location not found
        HTTPException: 401, You are not authorized to update this pickup location
        HTTPException: 500, Internal server error

    Returns:
        message: Pickup location updated successfully
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    pickup_location = (
        db.query(PickupLocation)
        .filter(PickupLocation.id == pickup_location_update_data.id)
        .first()
    )

    if pickup_location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pickup location not found"
        )

    if pickup_location.user_id is not user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to update this pickup location",
        )

    try:
        if pickup_location_update_data.name is not None:
            setattr(pickup_location, "name", pickup_location_update_data.name)
        if pickup_location_update_data.address is not None:
            setattr(pickup_location, "address", pickup_location_update_data.address)
        if pickup_location_update_data.apartment is not None:
            setattr(pickup_location, "apartment", pickup_location_update_data.apartment)
        if pickup_location_update_data.city is not None:
            setattr(pickup_location, "city", pickup_location_update_data.city)

        db.add(pickup_location)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Pickup location updated successfully"}


@router.delete("/pickup/delete/{pk}")
def delete_pickup_location(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to delete pickup location

    Args:
        pk (int): Pickup location id
        current_user (Any, optional):
                Currently logged in.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Pickup location not found
        HTTPException: 403, You are not authorized to delete this pickup location
        HTTPException: 500, Internal server error

    Returns:
        message: Pickup location deleted successfully
    """
    _, user_profile = get_user_and_profile(current_user, db)

    pickup_location = db.query(PickupLocation).filter(PickupLocation.id == pk).first()
    if pickup_location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pickup location not found"
        )

    if pickup_location.user_id is not user_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this pickup location",
        )

    try:
        db.delete(pickup_location)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Pickup location deleted successfully", "data": pickup_location}


@router.post("/contact/post", response_model=ContactInformationResponse)
def create_additional_contact(
    user_contact: ContactInformationCreate,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Create Additional Contact Information

    Args:
        current_user (Object, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        success message: Pickup location created successfully
    """

    _, user_profile = get_user_and_profile(current_user, db)

    contact_email = user_contact.contact_email
    contact_phone = user_contact.contact_phone
    if contact_email is not None:
        contact_email_exists = (
            db.query(ContactInformation)
            .with_entities(ContactInformation.id)
            .filter(ContactInformation.contact_email.ilike(contact_email))
            .first()
        )
        if contact_email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contact email already exists",
            )
    if contact_phone is not None:
        contact_phone_exists = (
            db.query(ContactInformation)
            .with_entities(ContactInformation.id)
            .filter(ContactInformation.contact_phone == contact_phone)
            .first()
        )
        if contact_phone_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contact phone already exists",
            )
    try:
        db_item_data = user_contact.model_dump(exclude_unset=True)
        db_item_data["user_id"] = user_profile.id
        contact = ContactInformation(**db_item_data)
        db.add(contact)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return contact


@router.get("/contact/get", response_model=ContactInformationResponseSchemaTotal)
def get_contact_information(
    current_user=Depends(jwt_service.get_current_user), db: Session = Depends(get_db)
):
    """API to get contact information

    Args:
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        PickupLocation: Pickup location
    """
    _, user_profile = get_user_and_profile(current_user, db)

    contact_information = (
        db.query(ContactInformation)
        .filter(ContactInformation.user_id == user_profile.id)
        .all()
    )

    if not contact_information:
        return {"message": "No contact information found"}

    total = (
        db.query(ContactInformation)
        .with_entities(func.count(ContactInformation.id))
        .scalar()
    )  # pylint: disable=not-callable

    response = {"total": total, "contact_information": contact_information}

    return response


@router.put("/contact/update")
def update_additional_contact(
    contact_information_data: ContactInformationUpdateSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to update contact information

    Args:
        contact_information_data (ContactInformationUpdateSchema, optional):
                contact_name,
                contact_email,
                contact_phone,
                contact_relationship,
                contact_type.
            Defaults to Depends().
        current_user (Any, optional):
                Currently logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Contact information not found
        HTTPException: 401, You are not authorized to update this contact information
        HTTPException: 500, Internal server error

    Returns:
        message: Contact information updated successfully
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    contact_information = (
        db.query(ContactInformation)
        .filter(ContactInformation.id == contact_information_data.id)
        .first()
    )

    if contact_information is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact information not found",
        )

    if contact_information.user_id is not user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to update this contact information",
        )

    try:
        if contact_information_data.contact_email is not None:
            setattr(
                contact_information,
                "contact_email",
                contact_information_data.contact_email,
            )
        if contact_information_data.contact_phone is not None:
            setattr(
                contact_information,
                "contact_phone",
                contact_information_data.contact_phone,
            )
        if contact_information_data.contact_name is not None:
            setattr(
                contact_information,
                "contact_name",
                contact_information_data.contact_name,
            )
        if contact_information_data.contact_relationship is not None:
            setattr(
                contact_information,
                "contact_relationship",
                contact_information_data.contact_relationship,
            )
        if contact_information_data.contact_type is not None:
            setattr(
                contact_information,
                "contact_type",
                contact_information_data.contact_type,
            )
        db.add(contact_information)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Contact information updated successfully"}


@router.delete("/contact/delete/{pk}")
def delete_additional_contact(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to delete contact information

    Args:
        pk (int): Contact information id
        current_user (Any, optional):
                Currently logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Contact information not found
        HTTPException: 403, You are not authorized to delete this contact information
        HTTPException: 500, Internal server error

    Returns:
        message: Contact information deleted successfully
    """
    _, user_profile = get_user_and_profile(current_user, db)

    contact = db.query(ContactInformation).filter(ContactInformation.id == pk).first()
    if contact is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact information not found",
        )

    if contact.user_id is not user_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this contact information",
        )

    try:
        db.delete(contact)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Contact information deleted successfully", "data": contact}
