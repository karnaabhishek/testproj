from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from apps.config.db.conn import get_db
from apps.core.models.transaction import Transaction
from apps.core.schemas.transaction import (
    TransactionCreate,
    TransactionCreateResponse,
    TransactionFilterSchema,
    TransactionResponseSchemaTotal,
    TransactionUpdate,
)
from apps.core.models.users import Users
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service

from apps.apis.v1.users.filter_sort import Filter, Sort


router = APIRouter(prefix="/account", tags=["account"])


@router.get("/get", response_model=TransactionResponseSchemaTotal)
# @check_role_permissions(["ADMIN", "CSR"])
def get_transactions(
    offset: int = 0,
    limit: int = 10,
    transactions_filter_params: TransactionFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    """API to get transactions for ADMIN and CSR

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        transactions_filter_params (TransactionFilterSchema, optional):
            transaction_id, user_id, sort, order. Defaults to Depends().
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Returns:
        response: {total: int, transactions: list[TransactionResponseSchema]}
    """
    query = db.query(Transaction).options(
        joinedload(Transaction.user).load_only(
            Users.first_name,
            Users.middle_name,
            Users.last_name,
        )
    )

    filter_params = {
        "amount": transactions_filter_params.amount,
        "discount": transactions_filter_params.discount,
        "method": transactions_filter_params.method,
        "location": transactions_filter_params.location,
        "transaction_id": transactions_filter_params.transaction_id,
        "user_id": transactions_filter_params.user_id,
        "is_deleted": transactions_filter_params.is_deleted,
        "date_charged": transactions_filter_params.date_charged,
    }

    filter_query = Filter().filter_transaction(query, **filter_params)
    filter_query = Sort().sort_transaction(
        query=filter_query,
        sort=transactions_filter_params.sort,
        order=transactions_filter_params.order,
    )

    total = filter_query.with_entities(Transaction.id).count()
    transactions = filter_query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "transactions": transactions,
    }


@router.post("/post", response_model=TransactionCreateResponse)
# @check_role_permissions("ADMIN", "CSR")
def create_transaction(
    transaction_data: TransactionCreate = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to create transaction for ADMIN and CSR

    Args:
        transaction_data (TransactionCreate, optional):
                amount,
                discount,
                method,
                location,
                user_id.
            Defaults to Depends().
        current_user (Any, optional):
                Used for check_role_permissions decorator DO NOT REMOVE.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 500, Internal server error

    Returns:
        db_transaction: TransactionCreateResponse
    """
    user_id_check = db.query(Users).filter(Users.id == transaction_data.user_id).first()

    if not user_id_check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    try:
        transaction_dict = transaction_data.model_dump()
        db_transaction = Transaction(**transaction_dict)
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return db_transaction


@router.put("/update")
# @check_role_permissions(["ADMIN", "CSR"])
def update_transaction(
    transaction_data: TransactionUpdate = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to update transaction for ADMIN and CSR

    Args:
        transaction_data (TransactionUpdate, optional):
                id(Required),
                user_id,
                amount,
                discount,
                method,
                location,
                date_charged,
                refund.
            Defaults to Depends().
        current_user (Any, optional):
            Used for check_role_permissions decorator DO NOT REMOVE.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Transaction not found
        HTTPException: 404, User not found
        HTTPException: 400, User id does not match
        HTTPException: 500, Internal server error

    Returns:
        message: Transaction updated successfully
    """
    transaction = (
        db.query(Transaction).filter(Transaction.id == transaction_data.id).first()
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    try:
        if transaction_data.user_id:
            user_id_check = (
                db.query(Users).filter(Users.id == transaction_data.user_id).first()
            )
            if not user_id_check:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
            if transaction.user_id is not transaction_data.user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User id does not match",
                )
            setattr(transaction, "user_id", transaction_data.user_id)
        if transaction_data.refund:
            setattr(transaction, "refund", transaction_data.refund)
        if transaction_data.amount:
            setattr(transaction, "amount", transaction_data.amount)
        if transaction_data.discount:
            setattr(transaction, "discount", transaction_data.discount)
        if transaction_data.method:
            setattr(transaction, "method", transaction_data.method)
        if transaction_data.location:
            setattr(transaction, "location", transaction_data.location)

        db.add(transaction)
        db.commit()
        db.refresh(transaction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Transaction updated successfully"}


@router.patch("/delete/{transaction_id}")
# @check_role_permissions(["ADMIN", "CSR"])
def delete_transaction(
    transaction_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to soft delete transaction by transaction_id for ADMIN and CSR

    Args:
        transaction_id (int): Transaction id
        current_user (Any, optional):
                Used for check_role_permissions decorator DO NOT REMOVE.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Transaction not found
        HTTPException: 500, Internal server errorb

    Returns:
        message: Transaction deleted successfully
        (not really deleted, just updated is_deleted to True)
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    try:
        setattr(transaction, "is_deleted", True)
        db.add(transaction)
        db.commit()
        # db.refresh(transaction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Transaction deleted successfully"}
