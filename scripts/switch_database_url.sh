#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.local}"
TARGET="${2:-local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: env file not found: $ENV_FILE" >&2
  exit 1
fi

case "$TARGET" in
  local)
    KEY="DATABASE_URL_LOCAL"
    ;;
  neon)
    KEY="DATABASE_URL_NEON"
    ;;
  *)
    echo "Usage: $0 [env-file] [local|neon]" >&2
    exit 1
    ;;
esac

VALUE="$(grep -E "^${KEY}=" "$ENV_FILE" | tail -n1 | cut -d'=' -f2- || true)"
if [[ -z "$VALUE" ]]; then
  echo "Error: ${KEY} is missing in ${ENV_FILE}" >&2
  exit 1
fi

if grep -qE '^DATABASE_URL=' "$ENV_FILE"; then
  sed -i.bak "s|^DATABASE_URL=.*$|DATABASE_URL=${VALUE}|" "$ENV_FILE"
else
  printf "\nDATABASE_URL=%s\n" "$VALUE" >> "$ENV_FILE"
fi

echo "Updated DATABASE_URL from ${KEY} in ${ENV_FILE}. Backup: ${ENV_FILE}.bak"
