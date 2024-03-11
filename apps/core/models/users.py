from sqlalchemy.orm import relationship
from sqlalchemy import Boolean, String, ForeignKey, Date, Time
from sqlalchemy import Column, Integer, DateTime, BigInteger
from sqlalchemy import Enum as SQLAlchemyEnum

from apps.config.db.base import Base
from apps.common.model import TimeStampMixin
from apps.common.enum import AppointmentStatusEnum, GenderEnum, RoleEnum


class Role(Base, TimeStampMixin):
    __tablename__ = "roles"

    name = Column(String(255))


class UserSchool(Base, TimeStampMixin):
    __tablename__ = "user_schools"

    user_id = Column(BigInteger, ForeignKey("users.id"), primary_key=True)
    school_id = Column(BigInteger, ForeignKey("schools.id"), primary_key=True)


class Users(Base, TimeStampMixin):
    __tablename__ = "users"

    first_name = Column(String(50), nullable=False)
    middle_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    initial_password = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)

    # role_id = Column(Integer, ForeignKey('roles.id'))
    # role = relationship("Role", backref="users")

    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # instructor = relationship("Users", backref="students")

    role = Column(SQLAlchemyEnum(RoleEnum), nullable=False, default=RoleEnum.STUDENT)

    transaction = relationship("Transaction", back_populates="user", lazy="joined")

    # school_id = Column(Integer, ForeignKey("schools.id"))  # for student
    school = relationship("School", back_populates="users", secondary="user_schools")

    # organization_id = Column(Integer, ForeignKey("organizations.id"))  # for Instructor
    # organization = relationship("Organization", back_populates="users", secondary="instructor_organizations")

    # permit_information = relationship("PermitInformation", backref='permit_user', join_depth=2, lazy="joined")
    # contact_information = relationship("ContactInformation", backref='contact_user', join_depth=2, lazy="joined")


class Profile(Base, TimeStampMixin):
    __tablename__ = "user_profiles"

    address = Column(String, nullable=True)
    office_note = Column(String, nullable=True)
    apartment = Column(String, nullable=True)

    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(Integer, nullable=True)
    dob = Column(Date, nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True)
    cell_phone = Column(BigInteger, nullable=True)

    contact_information = relationship(
        "ContactInformation", backref="user_profiles", join_depth=2, lazy="joined"
    )

    certificate_received = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("Users", backref="user_profile", lazy="joined")

    pickup_location = relationship(
        "PickupLocation",
        backref="user_profile",
        lazy="joined",
    )


class ContactInformation(Base, TimeStampMixin):
    __tablename__ = "user_contact_informations"

    contact_name = Column(String(255))
    contact_relationship = Column(String(255), nullable=True)
    contact_phone = Column(Integer, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_type = Column(String(255), nullable=True)

    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=True)
    # users = relationship("Users", backref="user_contacts", foreign_keys=[user_id])

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])


class PermitInformation(Base, TimeStampMixin):
    __tablename__ = "user_permit_informations"

    permit_number = Column(String(255))
    permit_issue_date = Column(DateTime, nullable=True)
    permit_expiration_date = Column(DateTime, nullable=True)
    permit_endorse_date = Column(DateTime, nullable=True)

    permit_endorse_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    permit_endorse_by = relationship(
        "Users",
        backref="permit_informations",
        join_depth=2,
        lazy="joined",
        foreign_keys=[permit_endorse_by_id],
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # users = relationship("Users", backref="user_permits", foreign_keys=[user_id])

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])


class PickupLocation(Base, TimeStampMixin):
    __tablename__ = "pickup_locations"

    name = Column(String(255))
    address = Column(String(255), nullable=True)
    apartment = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    # pickup_location_type = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=True)

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])


class InstructorOrganization(Base):
    __tablename__ = "instructor_organizations"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    instructor_id = Column(BigInteger, ForeignKey("users.id"))
    organization_id = Column(BigInteger, ForeignKey("organizations.id"))
    student_id = Column(BigInteger, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)


class StudentAppointment(Base, TimeStampMixin):
    __tablename__ = "student_appointment"

    instructor_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(Integer, ForeignKey("users.id"))

    appointment_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)

    status = Column(
        SQLAlchemyEnum(AppointmentStatusEnum),
        nullable=False,
        default=AppointmentStatusEnum.PENDING,
    )


class InstructorAvailability(Base, TimeStampMixin):
    __tablename__ = "instructor_availability"

    instructor_id = Column(Integer, ForeignKey("users.id"))

    availability_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
