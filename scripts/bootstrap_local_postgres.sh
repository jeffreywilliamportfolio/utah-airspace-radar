#!/usr/bin/env bash
set -euo pipefail

find_postgres_bin() {
  local binary_name="$1"
  if command -v "$binary_name" >/dev/null 2>&1; then
    command -v "$binary_name"
    return 0
  fi

  local homebrew_candidates=(
    "/opt/homebrew/opt/postgresql@16/bin/${binary_name}"
    "/opt/homebrew/opt/postgresql@15/bin/${binary_name}"
    "/usr/local/opt/postgresql@16/bin/${binary_name}"
    "/usr/local/opt/postgresql@15/bin/${binary_name}"
  )

  for candidate in "${homebrew_candidates[@]}"; do
    if [[ -x "$candidate" ]]; then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

PSQL_BIN="$(find_postgres_bin psql || true)"
PG_ISREADY_BIN="$(find_postgres_bin pg_isready || true)"

if [[ -z "${PSQL_BIN}" || -z "${PG_ISREADY_BIN}" ]]; then
  echo "Error: postgres tools are missing from PATH and Homebrew locations." >&2
  echo "Install with: brew install postgresql@16" >&2
  exit 1
fi

PGHOST="${PGHOST:-127.0.0.1}"
PGPORT="${PGPORT:-5432}"
APP_DB_NAME="${APP_DB_NAME:-utah_airspace}"
APP_DB_USER="${APP_DB_USER:-utah_airspace}"
APP_DB_PASSWORD="${APP_DB_PASSWORD:-utah_airspace_local_dev}"
ADMIN_DB="${ADMIN_DB:-postgres}"

if [[ ! "$APP_DB_NAME" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo "Error: APP_DB_NAME must be alphanumeric/underscore only." >&2
  exit 1
fi

if [[ ! "$APP_DB_USER" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo "Error: APP_DB_USER must be alphanumeric/underscore only." >&2
  exit 1
fi

if ! "$PG_ISREADY_BIN" -h "$PGHOST" -p "$PGPORT" >/dev/null 2>&1; then
  echo "Error: Postgres is not reachable at ${PGHOST}:${PGPORT}." >&2
  echo "Start Postgres first, then re-run this script." >&2
  exit 1
fi

"$PSQL_BIN" "postgresql://${PGHOST}:${PGPORT}/${ADMIN_DB}" -v ON_ERROR_STOP=1 <<SQL
DO
\$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${APP_DB_USER}') THEN
    CREATE ROLE ${APP_DB_USER} LOGIN PASSWORD '${APP_DB_PASSWORD}' CREATEDB;
  ELSE
    ALTER ROLE ${APP_DB_USER} CREATEDB;
  END IF;
END
\$\$;
SQL

DB_EXISTS="$("$PSQL_BIN" "postgresql://${PGHOST}:${PGPORT}/${ADMIN_DB}" -Atqc "SELECT 1 FROM pg_database WHERE datname='${APP_DB_NAME}'")"
if [[ "$DB_EXISTS" != "1" ]]; then
  "$PSQL_BIN" "postgresql://${PGHOST}:${PGPORT}/${ADMIN_DB}" -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${APP_DB_NAME} OWNER ${APP_DB_USER};"
fi

"$PSQL_BIN" "postgresql://${PGHOST}:${PGPORT}/${ADMIN_DB}" -v ON_ERROR_STOP=1 -c "GRANT ALL PRIVILEGES ON DATABASE ${APP_DB_NAME} TO ${APP_DB_USER};" >/dev/null

ENCODED_PASSWORD="$(python3 - <<PY
import urllib.parse
print(urllib.parse.quote('${APP_DB_PASSWORD}', safe=''))
PY
)"

echo "Bootstrap complete."
echo "DATABASE_URL_LOCAL=postgresql://${APP_DB_USER}:${ENCODED_PASSWORD}@${PGHOST}:${PGPORT}/${APP_DB_NAME}?schema=public"
