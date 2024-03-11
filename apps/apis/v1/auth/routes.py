import time
from fastapi import Depends, Form, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from apps.common.exception import (
    LoginException,
    UserNotFoundException,
    InvalidCredentialsException,
)
from apps.config import settings

from apps.config.db.conn import get_db
from apps.core.models import Users
from apps.core.models.otp_storage import OTPStorage
from apps.core.models.school_organization import School
from apps.core.models.users import Profile
from apps.core.schemas.auth import LoginResponseWithTokenType
from apps.core.schemas.user import UserCreateSchema
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service
from apps.services.send_email import send_email
from apps.utils.generate_otp import generate_numeric_otp


router = APIRouter(prefix="/auth")


@router.post("/login", response_model=LoginResponseWithTokenType)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login route"""
    try:
        user = jwt_service.authenticate_user(
            email=form_data.username, password=form_data.password, db=db
        )
    except (UserNotFoundException, InvalidCredentialsException) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e)
        ) from e

    if user.is_verified is not True:
        try:
            token = jwt_service.create_verification_token(data={"user_id": user.id})
            verification_link = (
                f"https://sfds.usualsmart.com/api/auth/verify?token={token}"
            )

            email_body = {
                "username": user.first_name.capitalize(),
                "verification_link": verification_link,
            }

            await send_email(
                subject="Verification email",
                receiver=[user.email],
                body=email_body,
                template_name="verification_login_template.html",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email to login",
        )

    basic_user_information = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }

    return LoginResponseWithTokenType(
        id=user.id,
        email=user.email,
        role=user.role,
        access_token=jwt_service.create_access_token(basic_user_information),
        refresh_token=jwt_service.create_refresh_token(basic_user_information),
        token_type="Bearer",
    )


@router.post("/register")
async def get_users(user: UserCreateSchema, db: Session = Depends(get_db)):
    """Register route"""

    db_item_data = user.model_dump(
        exclude_unset=True, exclude={"password", "role", "school"}
    )
    password = user.password
    hash_password = jwt_service.get_password_hash(password)
    db_item_data["password"] = hash_password
    role = user.role
    obj = Users(**db_item_data)

    if user.school:
        schools = db.query(School).filter(School.name.in_(user.school)).all()
        if len(schools) != len(user.school):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more schools do not exist",
            )
        for school in schools:
            obj.school.append(school)

    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)

        user_profile = Profile(user_id=obj.id)
        db.add(user_profile)
        db.commit()
        db.refresh(user_profile)
    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"E-mail already exists"
        ) from exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}") from e

    token = jwt_service.create_verification_token(data={"user_id": obj.id})

    verification_link = f"https://sfds.usualsmart.com/api/auth/verify?token={token}"

    email_body = {
        "username": user.first_name.capitalize(),
        "verification_link": verification_link,
    }

    await send_email(
        subject="Verification email",
        receiver=[user.email],
        body=email_body,
        template_name="verification_template.html",
    )

    return {
        "message": "User created successfully, please check your email to verify your account"
    }


@router.get("/verify")
async def verify(token: str, db: Session = Depends(get_db)):
    """Verify route"""

    try:
        # Decode the token
        payload = jwt_service.decode_verification_token(token)
        user_id = payload.get("user_id")

        # Get the user from the database
        user = db.query(Users).filter(Users.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        try:
            setattr(user, "is_verified", True)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
            ) from e

        return {"message": "User verified successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
        ) from e


@router.post("/token/refresh-token", response_model=dict)
async def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    """
    Get access token using refresh token

    :param refresh_token: secret refresh token
    :param db: Optional, database connection default: Depends(get_db)
    :return: access token and token type
    """

    user = jwt_service.validate_refresh_access_token(db=db, refresh_token=refresh_token)
    data = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }
    return {
        "access_token": jwt_service.create_access_token(data),
        "token_type": "Bearer",
    }


@router.get("/password/forget", response_model=dict)
async def forget_password(email: EmailStr, db: Session = Depends(get_db)):
    """
    Forget password rest api

    :param email: EmailStr
    :param db: Database connection
    :return: dict, success message
    """

    user = jwt_service.get_user(db=db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = await generate_numeric_otp(length=settings.OTP_LENGTH)
    expiration_time = int(time.time()) + 600

    email_exists = db.query(OTPStorage).filter(OTPStorage.email == email).first()
    if email_exists:
        await jwt_service.update_otp(
            db=db, email=email, otp=otp, expiration_time=expiration_time
        )
    else:
        await jwt_service.save_otp(
            db=db, email=email, otp=otp, expiration_time=expiration_time
        )

    await send_email(
        subject="OTP for password reset",
        receiver=[email],
        body={"otp": otp},
        template_name="otp_template.html",
    )

    return {"message": "Successfully send password reset link in your mail."}


@router.post("/password/verify-otp")
async def verify_otp(
    otp: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Verify OTP rest api

    :param email: EmailStr
    :param otp: str
    :param db: Database connection
    :return: dict, success message
    """

    verified_otp = await jwt_service.verify_otp(db=db, otp=otp)

    if not verified_otp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OTP doesn't match or expired. Please try again.",
        )

    return {"message": "OTP verified successfully"}

@router.post("/password/verify-otps")
async def verify_otp(
    otp: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Verify OTP rest api

    :param email: EmailStr
    :param otp: str
    :param db: Database connection
    :return: dict, success message
    """

    verified_otp = await jwt_service.verify_otp(db=db, otp=otp)

    if not verified_otp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OTP doesn't match or expired. Please try again.",
        )

    return {"message": "OTP verified successfully"}
@router.post("/password/reset", response_model=dict)
async def reset_password(
    otp: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Reset password rest api

    :param email: EmailStr
    :param new_password: str
    :param db: Database connection
    :return: dict, success message
    """

    user = (
        db.query(Users)
        .join(OTPStorage, Users.email == OTPStorage.email)
        .filter(and_(OTPStorage.otp == otp, Users.email == OTPStorage.email))
        .first()
    )

    verified_otp = await jwt_service.verify_otp(db=db, otp=otp)

    if not verified_otp:
        raise HTTPException(
            status_code=404, detail="OTP doesn't match or expired. Please try again."
        )

    if new_password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Password doesn't match"
        )

    new_hash_password = jwt_service.get_password_hash(new_password)

    try:
        setattr(user, "password", new_hash_password)
        db.add(user)
        db.commit()

        db.query(OTPStorage).filter(OTPStorage.otp == otp).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Password reset successfully"}


@router.post("/password/change", response_model=dict)
async def change_password(
    old_password: str = Form(...),
    new_password: str = Form(...),
    user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    if not jwt_service.verify_password(old_password, user.password):
        raise HTTPException(status_code=404, detail="Incorrect Old Password")

    new_hash_password = jwt_service.get_password_hash(new_password)

    user.password = new_hash_password

    try:
        db.add(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Password changed successfully"}
