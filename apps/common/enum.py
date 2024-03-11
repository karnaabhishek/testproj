from enum import Enum
from pickle import INST


class RoleEnum(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    CSR = "CSR"
    INSTRUCTOR = "INSTRUCTOR"
    STUDENT = "STUDENT"


class RoleUpdateEnum(str, Enum):
    INSTRUCTOR = "INSTRUCTOR"
    CSR = "CSR"
    STUDENT = "STUDENT"


class RoleFilterEnum(str, Enum):
    INSTRUCTOR = "INSTRUCTOR"
    STUDENT = "STUDENT"
    NOT_STUDENT = "NOT_STUDENT"
    ALL = "ALL"
    CSR = "CSR"
    ADMIN = "ADMIN"


class GenderEnum(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class UserSortEnum(str, Enum):
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    FIRST_NAME = "FIRST_NAME"


class OrderEnum(str, Enum):
    ASC = "ASC"
    DESC = "DESC"


class AppointmentStatusEnum(str, Enum):
    COMPLETED = "COMPLETED"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"
    UPCOMING = "UPCOMING"
    ON_GOING = "ON_GOING"


class AppointmentSortEnum(str, Enum):
    APPOINTMENT_DATE = "APPOINTMENT_DATE"
    START_TIME = "START_TIME"
    END_TIME = "END_TIME"


class InstructorAvailabilitySortEnum(str, Enum):
    AVAILABILITY_DATE = "AVAILABILITY_DATE"
    START_TIME = "START_TIME"
    END_TIME = "END_TIME"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    INSTRUCTOR_ID = "INSTRUCTOR_ID"


class TransactionMethodEnum(str, Enum):
    CASH = "CASH"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"
    DIGITAL = "DIGITAL"


class TransactionSortEnum(str, Enum):
    DATE_CHARGED = "DATE_CHARGED"
    AMOUNT = "AMOUNT"
    DISCOUNT = "DISCOUNT"
    METHOD = "METHOD"
    LOCATION = "LOCATION"
    REFUND = "REFUND"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    TRANSACTION_ID = "TRANSACTION_ID"
