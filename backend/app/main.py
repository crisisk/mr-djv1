from __future__ import annotations

import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import bookings, events, internal_classification


def _get_allowed_origins() -> List[str]:
    raw_origins = os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000",
    )
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    return origins or ["*"]


app = FastAPI(title="Mr. DJ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(internal_classification.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Mr. DJ API - Running", "status": "ok"}


@app.get("/health", tags=["system"])
async def health():
    events_status = events.health_status()
    bookings_status = bookings.health_status()
    status_flag = "healthy" if all(
        check.get("status") == "ok" for check in (events_status, bookings_status)
    ) else "degraded"
    return {
        "status": status_flag,
        "checks": {
            "events": events_status,
            "bookings": bookings_status,
        },
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
