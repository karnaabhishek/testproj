from datetime import timedelta
from apps.common.enum import RoleEnum, RoleFilterEnum
from apps.core.models.transaction import Transaction
from apps.core.models.users import (
    StudentAppointment,
    Users,
    Profile,
    InstructorAvailability,
)

from sqlalchemy import asc, desc
from sqlalchemy.orm import Query


class Sort:
    def generic_sorting(
        self, query: Query, sort: str, order: str, sorting_options: dict
    ) -> Query:
        """Generic method for sorting

        Args:
            query (Query): Sqlalchemy model query
            sort (str): sorting key
            order (str): ordering key, desc or asc
            sorting_options (dict): dictionary of sorting options

        Raises:
            ValueError: Invalid params

        Returns:
            Query: Sqlalchemy query
        """
        sorting_key = sorting_options.get(sort.lower(), None)

        if order.lower() == "asc":
            query = query.order_by(asc(sorting_key))
        elif order.lower() == "desc":
            query = query.order_by(desc(sorting_key))
        else:
            raise ValueError("Invalid order parameter. Use 'asc' or 'desc'.")

        return query

    def sorting_users(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "created_at": Users.created_at,
            "updated_at": Users.updated_at,
            "first_name": Users.first_name,
        }
        return self.generic_sorting(query, sort, order, sorting_options)

    def sorting_appointment(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "appointment_date": StudentAppointment.appointment_date,
            "start_time": StudentAppointment.start_time,
            "end_time": StudentAppointment.end_time,
        }

        # sorting_key = sorting_options.get(sort.lower())
        # if sorting_key is None:
        #     raise ValueError("Invalid sort parameter")

        return self.generic_sorting(query, sort, order, sorting_options)

    def sort_instructor_availability(
        self, query: Query, sort: str, order: str
    ) -> Query:
        sorting_options = {
            "availability_date": InstructorAvailability.availability_date,
            "start_time": InstructorAvailability.start_time,
            "end_time": InstructorAvailability.end_time,
            "created_at": InstructorAvailability.created_at,
            "updated_at": InstructorAvailability.updated_at,
            "instructor_id": InstructorAvailability.instructor_id,
        }

        return self.generic_sorting(query, sort, order, sorting_options)

    def sort_transaction(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "date_charged": Transaction.date_charged,
            "amount": Transaction.amount,
            "discount": Transaction.discount,
            "method": Transaction.method,
            "location": Transaction.location,
            "refund": Transaction.refund,
            "created_at": Transaction.created_at,
            "updated_at": Transaction.updated_at,
            "transaction_id": Transaction.id,
        }

        return self.generic_sorting(query, sort, order, sorting_options)


class Filter:
    def filter_users(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if first_name := params.get("first_name"):
            query = query.filter(Users.first_name.ilike(f"%{first_name}%"))

        if email := params.get("email"):
            query = query.filter(Users.email == email)

        if city := params.get("city"):
            query = query.join(Profile).filter(Profile.city.ilike(f"%{city}%"))

        if state := params.get("state"):
            query = query.join(Profile).filter(Profile.state.ilike(f"%{state}%"))

        if zip_code := params.get("zip_code"):
            query = query.join(Profile).filter(Profile.zip_code == zip_code)

        if role := params.get("role"):
            if role == RoleFilterEnum.ALL:
                pass
            elif role is RoleFilterEnum.NOT_STUDENT:
                query = query.filter(Users.role != RoleEnum.STUDENT)
            else:
                query = query.filter(Users.role == role)

        if school := params.get("school"):
            query = query.join(Users.school).filter(Users.school.any(name=school))

        return query

    def filter_appointment(self, query: Query, **kwargs) -> Query:
        """Filter Appointment Function

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """

        params = kwargs

        if student_id := params.get("student_id"):
            query = query.filter(StudentAppointment.student_id == student_id)

        if instructor_id := params.get("instructor_id"):
            query = query.filter(StudentAppointment.instructor_id == instructor_id)

        if appointment_date := params.get("appointment_date"):
            start_date = appointment_date - timedelta(days=2)
            end_date = appointment_date + timedelta(days=2)

            query = query.filter(
                StudentAppointment.appointment_date.between(start_date, end_date)
            )

        if status := params.get("status"):
            query = query.filter(StudentAppointment.status == status)

        return query

    def filter_instructor_availability(self, query: Query, **kwargs) -> Query:
        """Filter Instructor Availability

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """

        params = kwargs

        if availability_date := params.get("availability_date"):
            min_date = availability_date - timedelta(days=2)
            max_date = availability_date + timedelta(days=2)

            query = query.filter(
                InstructorAvailability.availability_date.between(min_date, max_date)
            )

        if start_time := params.get("start_time"):
            min_time = start_time - timedelta(minutes=30)
            max_time = start_time + timedelta(minutes=30)

            query = query.filter(
                InstructorAvailability.start_time.between(min_time, max_time)
            )

        if end_time := params.get("end_time"):
            min_time = end_time - timedelta(minutes=30)
            max_time = end_time + timedelta(minutes=30)

            query = query.filter(
                InstructorAvailability.end_time.between(min_time, max_time)
            )

        if instructor_id := params.get("instructor_id"):
            query = query.filter(InstructorAvailability.instructor_id == instructor_id)

        return query

    def filter_transaction(self, query: Query, **kwargs) -> Query:
        """Filter Transaction

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """

        params = kwargs

        if user_id := params.get("user_id"):
            query = query.filter(Transaction.user_id == user_id)

        if transaction_id := params.get("transaction_id"):
            query = query.filter(Transaction.id == transaction_id)

        if amount := params.get("amount"):
            query = query.filter(Transaction.amount == amount)

        if discount := params.get("discount"):
            query = query.filter(Transaction.discount == discount)

        if method := params.get("method"):
            query = query.filter(Transaction.method == method)

        if location := params.get("location"):
            query = query.filter(Transaction.location == location)

        is_deleted = params.get("is_deleted")
        if is_deleted is not None:
            # is_deleted can be False walrus operator doesn't work
            # as expected for falsy value like False or None
            query = query.filter(Transaction.is_deleted == is_deleted)

        if date_charged := params.get("date_charged"):
            max_date = date_charged + timedelta(days=1)
            min_date = date_charged - timedelta(days=1)

            query = query.filter(Transaction.date_charged.between(min_date, max_date))

        return query
