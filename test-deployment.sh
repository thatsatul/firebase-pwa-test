#!/bin/bash

# Test Firebase App Hosting deployment for push notifications
echo "==================================="
echo "Firebase PWA Push Notification Test"
echo "==================================="
echo ""

DEPLOYED_URL="https://firebase-pwa-test--fir-project-b052b.asia-southeast1.hosted.app"

echo "1. Testing deployed app accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYED_URL")
if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ App is accessible (HTTP $HTTP_CODE)"
else
  echo "   ❌ App returned HTTP $HTTP_CODE"
fi
echo ""

echo "2. Testing service worker endpoint..."
SW_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYED_URL/firebase-messaging-sw.js")
if [ "$SW_CODE" = "200" ]; then
  echo "   ✅ Service worker is accessible (HTTP $SW_CODE)"
  echo ""
  echo "3. Checking service worker content..."
  curl -s "$DEPLOYED_URL/firebase-messaging-sw.js" | head -20
else
  echo "   ❌ Service worker returned HTTP $SW_CODE"
fi
echo ""

echo "4. Testing manifest.json..."
MANIFEST_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYED_URL/manifest.json")
if [ "$MANIFEST_CODE" = "200" ]; then
  echo "   ✅ Manifest is accessible (HTTP $MANIFEST_CODE)"
else
  echo "   ❌ Manifest returned HTTP $MANIFEST_CODE"
fi
echo ""

echo "5. Checking if env vars are exposed in service worker..."
SW_CONTENT=$(curl -s "$DEPLOYED_URL/firebase-messaging-sw.js")
if echo "$SW_CONTENT" | grep -q "fir-project-b052b"; then
  echo "   ✅ Project ID found in service worker"
else
  echo "   ❌ Project ID NOT found in service worker"
fi

if echo "$SW_CONTENT" | grep -q "360732639627"; then
  echo "   ✅ Messaging sender ID found in service worker"
else
  echo "   ❌ Messaging sender ID NOT found in service worker"
fi
echo ""

echo "6. Testing debug page..."
DEBUG_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYED_URL/debug")
if [ "$DEBUG_CODE" = "200" ]; then
  echo "   ✅ Debug page is accessible (HTTP $DEBUG_CODE)"
  echo "   📱 Open $DEPLOYED_URL/debug on your mobile to see env vars"
else
  echo "   ⚠️  Debug page returned HTTP $DEBUG_CODE"
fi
echo ""

echo "==================================="
echo "Next Steps:"
echo "==================================="
echo "1. Open $DEPLOYED_URL on your mobile device"
echo "2. Click 'Enable Notifications' and grant permission"
echo "3. Copy the FCM token displayed"
echo "4. Go to Firebase Console → Cloud Messaging → Send test message"
echo "5. Paste the token and send"
echo ""
echo "If notifications still don't work, check:"
echo "- Mobile browser settings → Site permissions → Notifications (must be enabled)"
echo "- Device notification settings (Do Not Disturb mode off)"
echo "- Try both foreground (app open) and background (app in background/closed)"
