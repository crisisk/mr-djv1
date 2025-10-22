from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()


class BookingBase(BaseModel):
    event_id: int = Field(..., ge=1)
    customer_name: str = Field(..., min_length=2, max_length=120)
    customer_email: EmailStr
    message: str | None = Field(default=None, max_length=2000)


class BookingCreate(BookingBase):
    preferred_date: datetime | None = None


class Booking(BookingBase):
    id: int
    status: str = Field(default="pending", pattern=r"^(pending|confirmed|cancelled)$")
    created_at: datetime
    preferred_date: datetime | None = None


_BOOKINGS: list[Booking] = []
_BOOKING_SEQUENCE = 0


def _next_booking_id() -> int:
    global _BOOKING_SEQUENCE
    _BOOKING_SEQUENCE += 1
    return _BOOKING_SEQUENCE


@router.get("/", response_model=list[Booking], tags=["bookings"])
def list_bookings(status_filter: str | None = None) -> list[Booking]:
    if status_filter is None:
        return list(_BOOKINGS)
    return [booking for booking in _BOOKINGS if booking.status == status_filter]


@router.get("/{booking_id}", response_model=Booking, tags=["bookings"])
def get_booking(booking_id: int) -> Booking:
    for booking in _BOOKINGS:
        if booking.id == booking_id:
            return booking
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
    )


@router.post(
    "/", response_model=Booking, status_code=status.HTTP_201_CREATED, tags=["bookings"]
)
def create_booking(payload: BookingCreate) -> Booking:
    booking = Booking(
        id=_next_booking_id(),
        created_at=datetime.utcnow(),
        status="pending",
        **payload.model_dump(),
    )
    _BOOKINGS.append(booking)
    return booking


def health_status() -> dict:
    return {
        "status": "ok",
        "count": len(_BOOKINGS),
    }


__all__ = [
    "router",
    "health_status",
    "Booking",
    "BookingCreate",
]
