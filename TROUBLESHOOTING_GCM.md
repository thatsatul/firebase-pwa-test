# GCM Connection Troubleshooting

## Problem
Chrome shows "Connection State: CONNECTING" instead of "CONNECTED" in chrome://gcm-internals, preventing push notifications from being delivered.

## Solutions to Try (in order)

### 1. Force GCM Reset in Chrome
1. Go to `chrome://gcm-internals`
2. Click "Clear Logs" button at the top
3. Close ALL Chrome windows completely (Cmd+Q)
4. Wait 10 seconds
5. Reopen Chrome
6. Go back to `chrome://gcm-internals` - Connection State should now be "CONNECTED"

### 2. Check Network/Firewall
- Disable VPN if active
- Disable any firewall/antivirus temporarily
- Check if corporate network is blocking FCM endpoints

### 3. Try Different Network
- Switch from WiFi to mobile hotspot
- Or switch to different WiFi network
- GCM uses WebSocket connections that some networks block

### 4. Chrome Profile Reset
If above doesn't work:
1. Go to `chrome://settings/resetProfileSettings`
2. Click "Reset Settings"
3. Re-enable notification permissions for localhost

### 5. Test on Deployed URL
Instead of localhost, test on:
https://firebase-pwa-test--fir-project-b052b.asia-southeast1.hosted.app

Sometimes GCM works better on production domains vs localhost.

### 6. Check macOS Network Settings
1. System Settings → Network
2. Click "Details" on your active connection
3. Check if any proxy or VPN is configured
4. Ensure "Limit IP Address Tracking" is OFF

## Quick Test Script
After trying any solution, test with:
1. Go to https://localhost:3000
2. Open Console (Cmd+Option+J)
3. Check for `[SW]` logs
4. Go to chrome://gcm-internals
5. Verify "Connection State: CONNECTED"
6. Send test from Firebase Console
7. Should see `[SW] 🔔 RAW push event received!` in console
