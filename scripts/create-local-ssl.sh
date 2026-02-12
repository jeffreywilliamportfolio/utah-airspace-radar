#!/usr/bin/env bash
set -euo pipefail

CERT_DIR="${1:-./certs}"
KEY_FILE="${CERT_DIR}/localhost-key.pem"
CERT_FILE="${CERT_DIR}/localhost.pem"
CONF_FILE="${CERT_DIR}/openssl-localhost.cnf"

mkdir -p "$CERT_DIR"

cat > "$CONF_FILE" <<'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
CN = localhost

[v3_req]
subjectAltName = @alt_names
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

openssl req \
  -x509 \
  -nodes \
  -days 825 \
  -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -config "$CONF_FILE"

rm -f "$CONF_FILE"

echo "Generated:"
echo "  key:  $KEY_FILE"
echo "  cert: $CERT_FILE"
echo
echo "Start HTTPS dev server with:"
echo "  pnpm dev:https"
