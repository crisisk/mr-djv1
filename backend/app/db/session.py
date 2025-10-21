from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Generator, Optional

import psycopg2
from psycopg2.extensions import connection as _PGConnection


def _get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL environment variable is not set")
    return url


def get_connection(dsn: Optional[str] = None) -> _PGConnection:
    """Return a new psycopg2 connection using the configured DSN."""

    url = dsn or _get_database_url()
    return psycopg2.connect(url)


@contextmanager
def session_scope(dsn: Optional[str] = None) -> Generator[_PGConnection, None, None]:
    """Context manager that yields a database connection and ensures cleanup."""

    connection = get_connection(dsn=dsn)
    try:
        yield connection
        connection.commit()
    except Exception:  # pragma: no cover - passthrough
        connection.rollback()
        raise
    finally:
        connection.close()
