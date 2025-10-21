from pathlib import Path
import sys

BACKEND_ROOT = Path(__file__).resolve().parents[2]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_events_returns_seed_data():
    response = client.get("/api/events")
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    assert any(event["name"] == "Summer Beats Festival" for event in payload)


def test_get_event_by_id():
    response = client.get("/api/events/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["location"] == "Eindhoven"


def test_create_booking_and_fetch():
    create_response = client.post(
        "/api/bookings",
        json={
            "event_id": 1,
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "message": "Please confirm availability",
        },
    )
    assert create_response.status_code == 201
    booking = create_response.json()
    assert booking["status"] == "pending"

    list_response = client.get("/api/bookings")
    assert list_response.status_code == 200
    bookings = list_response.json()
    assert any(item["id"] == booking["id"] for item in bookings)


def test_health_endpoint_reports_bookings_and_events():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in {"healthy", "degraded"}
    assert "events" in data["checks"]
    assert "bookings" in data["checks"]
    assert data["checks"]["events"]["count"] >= 1
