#!/bin/sh
set -e

echo "=================================================="
echo "Frontend: Starting up!"
echo "Backend URL:     $BACKEND_URL"
echo "Sandbox SDK:     $SANDBOX_SDK"
echo "=================================================="

if [ -z "$BACKEND_URL" ]; then
  echo "ERROR! INVALID CONFIGURATION: BACKEND_URL must be defined."
  exit 1
fi

# Replace placeholders in index.html
sed -i 's;\$\$BACKEND_URL\$\$;'"${BACKEND_URL}"';g' /var/www/webapp/index.html
sed -i 's;\$\$SANDBOX_SDK\$\$;'"${SANDBOX_SDK}"';g' /var/www/webapp/index.html

echo "Starting Nginx..."
nginx -g "daemon off;"