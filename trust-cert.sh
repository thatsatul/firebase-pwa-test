#!/bin/bash

echo "Installing CA Certificate to System Keychain..."
echo "You will be prompted for your macOS password."
echo ""

CERT_PATH="$(pwd)/certificates/ca.crt"

if [ ! -f "$CERT_PATH" ]; then
    echo "Error: Certificate not found at $CERT_PATH"
    exit 1
fi

sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$CERT_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Certificate installed successfully!"
    echo "Please restart your browser for changes to take effect."
    echo ""
    echo "Then visit: https://localhost:3000"
else
    echo ""
    echo "❌ Failed to install certificate."
    echo "Please try the manual steps in the documentation."
fi
