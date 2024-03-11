from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from apps.apis.v1.users.filter_sort import Filter, Sort
from apps.common.enum import (
    RoleEnum,
    RoleFilterEnum,
    RoleUpdateEnum,
)
from apps.config.db.conn import get_db
from apps.core.models.school_organization import School
from apps.core.models.users import Role, Users, Profile
from apps.core.schemas.user import (
    UserResponseSchemaTotal,
    AdminUserCreateSchema,
    UserResponseSchema,
    UserFilterSchema,
)
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service
from apps.services.send_email import send_email


router = APIRouter(prefix="/user", tags=["user"])


@router.post("/verifies")
async def verify_user(
    current_user: Users = Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    user = jwt_service.get_user(db=db, email=current_user.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already verified"
        )

    token = jwt_service.create_verification_token(data={"user_id": user.id})

    verification_link = f"https://sfds.usualsmart.com/api/auth/verify?token={token}"

    email_body = {
        "username": user.first_name.capitalize(),
        "verification_link": verification_link,
    }

    await send_email(
        subject="Verification email",
        receiver=[user.email],
        body=email_body,
        template_name="verification_user_template.html",
    )

    return {"message": "Verification email sent successfully"}


@router.get("/get", response_model=UserResponseSchemaTotal)
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"]) # Disabled for now
def get_user_sort_filter(
    offset: int = 0,
    limit: int = 10,
    user_filter_params: UserFilterSchema = Depends(),
    # current_user = Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to get user profile(for CSR, ADMIN, INSTRUCTOR)

    Args:
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """

    query = db.query(Users)

    filter_params = {
        "first_name": user_filter_params.first_name,
        "email": user_filter_params.email,
        "city": user_filter_params.city,
        "state": user_filter_params.state,
        "zip_code": user_filter_params.zip_code,
        "role": user_filter_params.role,
        "school": user_filter_params.school,
    }

    query = Filter().filter_users(query, **filter_params)
    query = Sort().sorting_users(
        query=query, sort=user_filter_params.sort, order=user_filter_params.order
    )

    total_count = query.with_entities(Users.id, Users.role)

    if user_filter_params.role in [RoleFilterEnum.ALL, RoleFilterEnum.NOT_STUDENT]:
        total_count = query.count()
    else:
        total_count = query.filter(Users.role == user_filter_params.role).count()

    response = {
        "total_count": total_count,
        "users": query.offset(offset).limit(limit).all(),
    }

    return response


@router.get("/get/{pk}", response_model=UserResponseSchema)
@check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"])  # Disabled for now
def get_user_by_id(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to get user by ID

    Args:
        pk (int): User ID
        current_user (Object, optional): currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        User object: User object
    """

    user = db.query(Users).filter(Users.id == pk).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.patch("/update/role/{pk}")
# @check_role_permissions(["ADMIN", "CSR"]) # Disabled for now
def update_user_role(
    pk: int,
    role: RoleUpdateEnum = RoleUpdateEnum.STUDENT,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to change user role

    Args:
        pk (int): User ID
        role (RoleEnum, optional): Roles are STUDENT, INSTRUCTOR, CSR, ADMIN. Defaults to RoleEnum.STUDENT.
        current_user (Object, optional): currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        success message: Role updated successfully
    """
    if role not in [
        RoleUpdateEnum.STUDENT,
        RoleUpdateEnum.INSTRUCTOR,
        RoleUpdateEnum.CSR,
    ]:
        return {"message": "Invalid role"}

    db.query(Users).filter(Users.id == pk).update({"role": role})
    db.commit()

    return {"message": "Role updated successfully"}


@router.put("/post")
# @check_role_permissions(["ADMIN", "CSR"])  # Disabled for now
async def create_user_admin(
    user_data: AdminUserCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to create user profile(for ADMIN, CSR)
    :param current_user:
    :param db:
    :return:
    """

    db_item_data = user_data.model_dump(exclude_unset=True, exclude={"school"})
    password = db_item_data.pop("password")
    hash_password = jwt_service.get_password_hash(password)
    db_item_data["password"] = hash_password

    profile_data = {
        k: db_item_data.pop(k)
        for k in [
            "cell_phone",
            "address",
            "apartment",
            "city",
            "state",
            "dob",
            "gender",
        ]
    }

    obj = Users(**db_item_data)

    if user_data.school:
        schools = db.query(School).filter(School.name.in_(user_data.school)).all()
        if len(schools) != len(user_data.school):
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

        profile_data["user_id"] = obj.id
        user_profile = Profile(**profile_data)
        db.add(user_profile)
        db.commit()
        db.refresh(user_profile)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        ) from e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    try:
        if obj.role is RoleEnum.STUDENT:
            token = jwt_service.create_verification_token(data={"user_id": obj.id})

            redirect_link = (
                f"http://localhost:8000/docs/api/user/verify/password?token={token}"
            )

            email_body = {
                "username": obj.first_name.capitalize(),
                "redirect_link": redirect_link,
            }

            await send_email(
                subject="Verification email",
                receiver=[obj.email],
                body=email_body,
                template_name="verification_student_template.html",
            )

        if obj.role is not RoleEnum.STUDENT:
            email_body = {
                "username": obj.first_name.capitalize(),
                "email": obj.email,
                "password": password,
            }

            await send_email(
                subject="Verification email",
                receiver=[obj.email],
                body=email_body,
                template_name="verification_admin_template.html",
            )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send email",
        ) from e

    return {"message": "User created successfully"}


@router.post("/verify/password")
def verify_user_and_change_password(
    token: str,
    new_password: str = Form(...),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt_service.decode_verification_token(token)
        user_id = payload.get("user_id")

        user = db.query(Users).filter(Users.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
        ) from e

    try:
        setattr(user, "is_verified", True)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"{str(e)}"
        ) from e

    try:
        hash_password = jwt_service.get_password_hash(new_password)
        setattr(user, "password", hash_password)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Password updated successfully"}


@router.delete("/delete/{pk}")
@check_role_permissions(["ADMIN"])
def delete_user(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Route to delete user

    Args:
        pk (int): user id
        current_user (_type_, optional): Used for role permission decorator DO NOT remove.
                                        Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).
    """

    user = db.query(Users).filter(Users.id == pk).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_profile = db.query(Profile).filter(Profile.user_id == pk).first()
    if not user_profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    db.delete(user)
    db.commit()

    db.delete(user_profile)
    db.commit()

    return {"message": "User deleted successfully"}
