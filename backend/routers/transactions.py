from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database import get_db
import models, schemas
from auth import get_current_user, require_role
import pandas as pd
import io

router = APIRouter(prefix="/transactions", tags=["Transactions"])
staff_or_above = require_role("ADMIN", "MANAGER", "STAFF")
manager_or_above = require_role("ADMIN", "MANAGER")

@router.post("/", response_model=schemas.TransactionOut, status_code=201)
def create_transaction(
    tx_in: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(staff_or_above)
):
    product = db.query(models.Product).filter(models.Product.id == tx_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if tx_in.type == "OUT":
        if product.quantity < tx_in.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Available: {product.quantity}")
        product.quantity -= tx_in.quantity
    else:
        product.quantity += tx_in.quantity
        product.import_date = datetime.utcnow()

    tx = models.InventoryTransaction(
        product_id=tx_in.product_id,
        type=tx_in.type,
        quantity=tx_in.quantity,
        note=tx_in.note
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    result = schemas.TransactionOut.model_validate(tx)
    result.product_name = product.name
    return result

@router.get("/", response_model=List[schemas.TransactionOut])
def list_transactions(
    product_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user)
):
    q = db.query(models.InventoryTransaction).join(models.Product)
    if product_id:
        q = q.filter(models.InventoryTransaction.product_id == product_id)
    if type:
        q = q.filter(models.InventoryTransaction.type == type)
    if date_from:
        q = q.filter(models.InventoryTransaction.transaction_date >= date_from)
    if date_to:
        q = q.filter(models.InventoryTransaction.transaction_date <= date_to)
    txs = q.order_by(models.InventoryTransaction.transaction_date.desc()).all()
    results = []
    for tx in txs:
        r = schemas.TransactionOut.model_validate(tx)
        r.product_name = tx.product.name if tx.product else None
        results.append(r)
    return results

@router.get("/export/csv")
def export_csv(
    db: Session = Depends(get_db),
    _: models.User = Depends(manager_or_above)
):
    txs = db.query(models.InventoryTransaction).join(models.Product).order_by(
        models.InventoryTransaction.transaction_date.desc()
    ).all()
    data = [{
        "ID": tx.id,
        "Product": tx.product.name if tx.product else "",
        "Type": tx.type,
        "Quantity": tx.quantity,
        "Date": tx.transaction_date.strftime("%Y-%m-%d %H:%M:%S"),
        "Note": tx.note or ""
    } for tx in txs]
    df = pd.DataFrame(data)
    stream = io.StringIO()
    df.to_csv(stream, index=False, encoding="utf-8-sig")
    stream.seek(0)
    return StreamingResponse(
        io.BytesIO(stream.getvalue().encode("utf-8-sig")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"}
    )

@router.get("/export/excel")
def export_excel(
    db: Session = Depends(get_db),
    _: models.User = Depends(manager_or_above)
):
    txs = db.query(models.InventoryTransaction).join(models.Product).order_by(
        models.InventoryTransaction.transaction_date.desc()
    ).all()
    data = [{
        "ID": tx.id,
        "Sản phẩm": tx.product.name if tx.product else "",
        "Loại": "Nhập" if tx.type == "IN" else "Xuất",
        "Số lượng": tx.quantity,
        "Ngày giao dịch": tx.transaction_date.strftime("%Y-%m-%d %H:%M:%S"),
        "Ghi chú": tx.note or ""
    } for tx in txs]
    df = pd.DataFrame(data)
    stream = io.BytesIO()
    with pd.ExcelWriter(stream, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Lịch sử giao dịch")
    stream.seek(0)
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=transactions.xlsx"}
    )
