"""Production-ready WhatsApp Business API service utilities.

This module replaces the earlier JavaScript example with a concrete Python
implementation that can be imported by FastAPI routes or background workers.
It encapsulates outbound messaging to the WhatsApp Business Platform (BSP)
with secure authentication helpers for HMAC protected integrations.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import time
from dataclasses import dataclass
from typing import Iterable, Mapping, MutableMapping, Optional

import httpx

__all__ = [
    "WhatsAppConfig",
    "WhatsAppService",
    "WhatsAppServiceError",
    "WhatsAppAuthenticationError",
    "WhatsAppNotConfiguredError",
    "verify_integration_signature",
]

DEFAULT_API_BASE_URL = "https://graph.facebook.com/v19.0"
DEFAULT_TIMEOUT_SECONDS = 5.0
DEFAULT_BOOKING_TEMPLATE = os.getenv(
    "WHATSAPP_BOOKING_TEMPLATE", "mr_dj_booking_confirmation"
)
DEFAULT_LANGUAGE_CODE = os.getenv("WHATSAPP_DEFAULT_LANGUAGE", "en_US")


class WhatsAppServiceError(RuntimeError):
    """Base exception for WhatsApp service failures."""

    def __init__(
        self, message: str, *, code: str = "whatsapp_error", status_code: int = 500
    ) -> None:
        super().__init__(message)
        self.code = code
        self.status_code = status_code


class WhatsAppAuthenticationError(WhatsAppServiceError):
    """Raised when requests fail authentication or signature checks."""

    def __init__(
        self,
        message: str = "Authentication failed",
        *,
        code: str = "whatsapp_auth_error",
    ) -> None:
        super().__init__(message, code=code, status_code=401)


class WhatsAppNotConfiguredError(WhatsAppServiceError):
    """Raised when mandatory configuration is missing."""

    def __init__(self) -> None:
        super().__init__(
            "WhatsApp integration is not configured",
            code="whatsapp_not_configured",
            status_code=503,
        )


@dataclass(slots=True)
class WhatsAppConfig:
    """Configuration container for the WhatsApp Business API."""

    access_token: str
    phone_number_id: str
    app_secret: Optional[str] = None
    api_base_url: str = DEFAULT_API_BASE_URL
    request_timeout: float = DEFAULT_TIMEOUT_SECONDS

    @classmethod
    def from_env(cls, env: Optional[Mapping[str, str]] = None) -> "WhatsAppConfig":
        env = env or os.environ
        timeout_ms = env.get("WHATSAPP_REQUEST_TIMEOUT_MS")
        try:
            timeout = (
                max(float(timeout_ms) / 1000.0, 0.5)
                if timeout_ms
                else DEFAULT_TIMEOUT_SECONDS
            )
        except (TypeError, ValueError):
            timeout = DEFAULT_TIMEOUT_SECONDS

        return cls(
            access_token=env.get("WHATSAPP_ACCESS_TOKEN", ""),
            phone_number_id=env.get("WHATSAPP_PHONE_NUMBER_ID", ""),
            app_secret=env.get("WHATSAPP_APP_SECRET"),
            api_base_url=env.get("WHATSAPP_API_BASE_URL", DEFAULT_API_BASE_URL),
            request_timeout=timeout,
        )

    @property
    def is_configured(self) -> bool:
        return bool(self.access_token and self.phone_number_id)

    @property
    def normalised_base_url(self) -> str:
        return (
            self.api_base_url
            if self.api_base_url.endswith("/")
            else f"{self.api_base_url}/"
        )


def _create_app_secret_proof(
    access_token: str, app_secret: Optional[str]
) -> Optional[str]:
    if not access_token or not app_secret:
        return None
    digest = hmac.new(
        app_secret.encode("utf-8"), access_token.encode("utf-8"), hashlib.sha256
    )
    return digest.hexdigest()


def _normalise_phone_number(phone_number: str) -> str:
    digits = "".join(ch for ch in phone_number if ch.isdigit() or ch == "+")
    if digits and not digits.startswith("+"):
        return f"+{digits}"
    return digits


def _parse_signature_header(header: str) -> tuple[int, str]:
    try:
        parts = dict(part.split("=", 1) for part in header.split(","))
        timestamp = int(parts.get("t", "0"))
        digest = parts.get("v1")
    except ValueError as exc:  # pragma: no cover - defensive guard
        raise WhatsAppAuthenticationError("Invalid signature header format") from exc

    if not timestamp or not digest:
        raise WhatsAppAuthenticationError("Incomplete signature header")

    return timestamp, digest


def verify_integration_signature(
    header: Optional[str],
    payload: bytes | str,
    *,
    secrets: Iterable[str],
    tolerance_seconds: int = 300,
) -> str:
    """Validate an HMAC signature following the Meta webhook format.

    Returns the secret that successfully verified the payload. Raises
    :class:`WhatsAppAuthenticationError` when verification fails.
    """

    if header is None:
        raise WhatsAppAuthenticationError("Missing integration signature header")

    secrets = [secret for secret in secrets if secret]
    if not secrets:
        raise WhatsAppAuthenticationError("No integration secrets configured")

    if isinstance(payload, str):
        payload_bytes = payload.encode("utf-8")
    else:
        payload_bytes = payload

    timestamp, digest = _parse_signature_header(header)
    now = int(time.time())
    if tolerance_seconds and abs(now - timestamp) > tolerance_seconds:
        raise WhatsAppAuthenticationError(
            "Signature timestamp outside tolerance", code="timestamp_out_of_range"
        )

    message = f"{timestamp}.{payload_bytes.decode('utf-8')}".encode("utf-8")

    for secret in secrets:
        candidate = hmac.new(
            secret.encode("utf-8"), message, hashlib.sha256
        ).hexdigest()
        if hmac.compare_digest(candidate, digest):
            return secret

    raise WhatsAppAuthenticationError(
        "Signature verification failed", code="signature_mismatch"
    )


class WhatsAppService:
    """Helper around the WhatsApp Business messaging endpoints."""

    def __init__(
        self,
        config: Optional[WhatsAppConfig] = None,
        client: Optional[httpx.Client] = None,
    ) -> None:
        self.config = config or WhatsAppConfig.from_env()
        self._owns_client = client is None
        self._client = client or httpx.Client(timeout=self.config.request_timeout)

    def close(self) -> None:
        if self._owns_client:
            self._client.close()

    def _ensure_configured(self) -> None:
        if not self.config.is_configured:
            raise WhatsAppNotConfiguredError()

    def _build_url(
        self, path: str, params: Optional[MutableMapping[str, str]] = None
    ) -> str:
        base = self.config.normalised_base_url
        params = params or {}
        if proof := _create_app_secret_proof(
            self.config.access_token, self.config.app_secret
        ):
            params.setdefault("appsecret_proof", proof)
        query = "&".join(f"{key}={value}" for key, value in params.items())
        return f"{base}{path}?{query}" if query else f"{base}{path}"

    def _post(self, path: str, payload: Mapping[str, object]) -> Mapping[str, object]:
        self._ensure_configured()
        url = self._build_url(path)
        headers = {
            "Authorization": f"Bearer {self.config.access_token}",
            "Content-Type": "application/json",
        }
        try:
            response = self._client.post(
                url, headers=headers, content=json.dumps(payload)
            )
        except httpx.TimeoutException as exc:
            raise WhatsAppServiceError(
                "WhatsApp API request timed out",
                code="whatsapp_timeout",
                status_code=504,
            ) from exc
        except httpx.HTTPError as exc:
            raise WhatsAppServiceError("WhatsApp API request failed") from exc

        if response.status_code >= 400:
            raise WhatsAppServiceError(
                f"WhatsApp API responded with {response.status_code}: {response.text}",
                code="whatsapp_api_error",
                status_code=response.status_code,
            )

        return response.json()

    def send_template_message(
        self,
        *,
        phone_number: str,
        template_name: Optional[str] = None,
        language_code: Optional[str] = None,
        components: Optional[list[Mapping[str, object]]] = None,
    ) -> Mapping[str, object]:
        number = _normalise_phone_number(phone_number or "")
        if not number:
            raise WhatsAppServiceError(
                "Invalid phone number provided",
                code="invalid_phone_number",
                status_code=400,
            )

        payload = {
            "messaging_product": "whatsapp",
            "to": number,
            "type": "template",
            "template": {
                "name": template_name or DEFAULT_BOOKING_TEMPLATE,
                "language": {"code": language_code or DEFAULT_LANGUAGE_CODE},
            },
        }
        if components:
            payload["template"]["components"] = components

        return self._post(f"{self.config.phone_number_id}/messages", payload)

    def send_text_message(
        self, *, phone_number: str, message: str
    ) -> Mapping[str, object]:
        number = _normalise_phone_number(phone_number or "")
        if not number:
            raise WhatsAppServiceError(
                "Invalid phone number provided",
                code="invalid_phone_number",
                status_code=400,
            )

        body = (message or "").strip()
        if not body:
            raise WhatsAppServiceError(
                "Message body is required", code="invalid_message", status_code=400
            )

        payload = {
            "messaging_product": "whatsapp",
            "to": number,
            "type": "text",
            "text": {"body": body, "preview_url": False},
        }
        return self._post(f"{self.config.phone_number_id}/messages", payload)

    def send_booking_confirmation(
        self,
        *,
        phone_number: str,
        booking_details: Optional[Mapping[str, object]] = None,
    ) -> Mapping[str, object]:
        booking_details = booking_details or {}
        parameters = []
        if event_date := booking_details.get("eventDate"):
            parameters.append({"type": "text", "text": str(event_date)})
        if location := booking_details.get("location"):
            parameters.append({"type": "text", "text": str(location)})

        components = (
            [{"type": "body", "parameters": parameters}] if parameters else None
        )
        return self.send_template_message(
            phone_number=phone_number,
            template_name=DEFAULT_BOOKING_TEMPLATE,
            language_code=DEFAULT_LANGUAGE_CODE,
            components=components,
        )

    def __enter__(self) -> "WhatsAppService":
        return self

    def __exit__(self, *_exc_info) -> None:
        self.close()
