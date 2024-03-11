from tabnanny import check
from fastapi import (
    APIRouter,
    Depends,
    Form,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.school_organization import School
from apps.core.schemas.school_organization import (
    SchoolOrganizationCreate,
    SchoolResponseSchema,
    SchoolResponseSchemaTotal,
    SchoolUpdateSchema,
)
from apps.rbac.role_permission_decorator import check_role_permissions


router = APIRouter(prefix="/school", tags=["school"])


@router.post("/create")
def create_school(school_data: SchoolOrganizationCreate, db: Session = Depends(get_db)):
    school_exist = db.query(School).filter(School.name == school_data.name).first()

    if school_exist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="School already exist"
        )

    school = School(**school_data.model_dump())

    try:
        db.add(school)
        db.commit()
        db.refresh(school)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "School created successfully"}


# @router.get("/get", response_model=SchoolResponseSchemaTotal)
@router.get("/get")
def get_school(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.is_deleted == False)

    response = {
        "total_count": school.count(),
        "school": school.limit(limit).offset(offset).all(),
    }

    return response


@router.get("/get/{school_id}", response_model=SchoolResponseSchema)
def get_school_by_id(
    school_id: int,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()

    if getattr(school, "is_deleted"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    return school


@router.put("/update/{school_id}")
def update_school(
    school_id: int,
    school_data: SchoolUpdateSchema,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    try:
        for key, value in school_data.model_dump().items():
            setattr(school, key, value)

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "School updated successfully"}


@router.delete("/delete/{school_id}")
@check_role_permissions(["ADMIN"])
def delete_school(
    school_id: int,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    try:
        setattr(school, "is_deleted", True)
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "School deleted successfully"}
