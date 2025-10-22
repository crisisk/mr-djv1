from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter()


class Event(BaseModel):
    id: int
    name: str
    date: date
    location: str
    price: float = Field(..., ge=0)
    description: str | None = None
    is_active: bool = True


class EventCreate(BaseModel):
    name: str
    date: date
    location: str
    price: float = Field(..., ge=0)
    description: str | None = None
    is_active: bool = True


_EVENTS: list[Event] = [
    Event(
        id=1,
        name="Summer Beats Festival",
        date=date(2025, 6, 21),
        location="Eindhoven",
        price=199.0,
        description="Main stage hosting with afterparty DJ set.",
    ),
    Event(
        id=2,
        name="Corporate Gala Night",
        date=date(2025, 3, 12),
        location="Amsterdam",
        price=149.0,
        description="Black-tie event with curated music experience.",
    ),
    Event(
        id=3,
        name="Luxury Wedding",
        date=date(2025, 8, 17),
        location="Rotterdam",
        price=299.0,
        description="Full wedding production with lighting design.",
    ),
]


def _filter_events(
    *,
    location: str | None = None,
    is_active: bool | None = None,
) -> list[Event]:
    events = list(_EVENTS)
    if location:
        location_lower = location.lower()
        events = [event for event in events if location_lower in event.location.lower()]
    if is_active is not None:
        events = [event for event in events if event.is_active == is_active]
    return events


@router.get("/", response_model=list[Event], tags=["events"])
def list_events(
    location: str | None = Query(
        default=None, description="Filter events by location (contains match)"
    ),
    is_active: bool | None = Query(default=None, description="Filter on active status"),
) -> list[Event]:
    return _filter_events(location=location, is_active=is_active)


@router.get("/{event_id}", response_model=Event, tags=["events"])
def get_event(event_id: int) -> Event:
    for event in _EVENTS:
        if event.id == event_id:
            return event
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")


@router.post(
    "/", response_model=Event, status_code=status.HTTP_201_CREATED, tags=["events"]
)
def create_event(payload: EventCreate) -> Event:
    new_id = max((event.id for event in _EVENTS), default=0) + 1
    event = Event(id=new_id, **payload.model_dump())
    _EVENTS.append(event)
    return event


def health_status() -> dict:
    return {
        "status": "ok" if _EVENTS else "empty",
        "count": len(_EVENTS),
    }


__all__ = ["router", "health_status", "Event", "EventCreate"]
