from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    STAFF = "STAFF"

class TransactionTypeEnum(str, Enum):
    IN = "IN"
    OUT = "OUT"

# ─── Auth ────────────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# ─── User ────────────────────────────────────────────────────────────────────
class UserBase(BaseModel):
    username: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[RoleEnum] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# ─── Product ─────────────────────────────────────────────────────────────────
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float = 0.0
    quantity: int = 0
    import_date: Optional[datetime] = None
    expiration_date: Optional[datetime] = None
    low_stock_threshold: int = 10

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    import_date: Optional[datetime] = None
    expiration_date: Optional[datetime] = None
    low_stock_threshold: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# ─── Transaction ─────────────────────────────────────────────────────────────
class TransactionCreate(BaseModel):
    product_id: int
    type: TransactionTypeEnum
    quantity: int
    note: Optional[str] = None

class TransactionOut(BaseModel):
    id: int
    product_id: int
    type: TransactionTypeEnum
    quantity: int
    transaction_date: datetime
    note: Optional[str] = None
    product_name: Optional[str] = None
    class Config:
        from_attributes = True
