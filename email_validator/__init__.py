"""Lightweight stub for the email_validator package used in tests."""

from dataclasses import dataclass
from types import SimpleNamespace


@dataclass
class EmailNotValidError(Exception):
    message: str

    def __str__(self) -> str:
        return self.message


def validate_email(email: str, *_, **__):
    if "@" not in email:
        raise EmailNotValidError("Invalid email address")
    local, domain = email.split("@", 1)
    return SimpleNamespace(
        email=email,
        local_part=local,
        domain=domain,
        normalized=email.lower(),
    )
