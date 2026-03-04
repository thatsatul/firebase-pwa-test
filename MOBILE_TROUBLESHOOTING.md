# Mobile Push Notification Troubleshooting Guide

## Current Status
✅ App deployed: https://firebase-pwa-test--fir-project-b052b.asia-southeast1.hosted.app
✅ Service worker accessible and correctly configured
✅ All Firebase env vars present
✅ Manifest.json accessible

## Testing Steps (Mobile Device)

### 1. Open the App
- URL: https://firebase-pwa-test--fir-project-b052b.asia-southeast1.hosted.app
- Use Chrome or Safari on your mobile device

### 2. Enable Notifications
- Click "Enable Notifications" button
- Grant permission when prompted
- The FCM token will be displayed and copied to clipboard
- Check the "Debug Logs" section at the bottom for any errors

### 3. Send Test Notification
- Go to Firebase Console: https://console.firebase.google.com/project/fir-project-b052b/messaging
- Click "Send your first message" or "New campaign"
- Enter title and body
- Click "Send test message"
- Paste your FCM token
- Click "Test"

## Common Issues & Solutions

### Issue 1: "Notification permission denied"
**Cause**: Browser blocked notifications
**Solution**:
- Chrome: Settings → Site settings → Notifications → Allow
- Safari: Settings → Safari → Notifications → Allow

### Issue 2: "Service Worker registration failed"
**Cause**: HTTPS required, or browser doesn't support SW
**Solution**:
- Ensure you're using HTTPS (Firebase App Hosting provides this)
- Try Chrome/Edge (best PWA support)
- Avoid private/incognito mode

### Issue 3: "Token obtained but no notification received"
**Possible causes**:

#### A. Device notification settings
- Check: Device Settings → Notifications → Chrome/Safari → Enabled
- Disable "Do Not Disturb" or "Focus" mode
- Ensure notifications aren't blocked for the site

#### B. Testing foreground vs background
- **Foreground**: App is open and visible → notification shows via `onMessage()` handler
- **Background**: App is minimized or closed → notification shows via service worker

Try both scenarios:
1. Keep app open (foreground) → should show notification immediately
2. Put app in background or close browser → should still receive notification

#### C. Token mismatch
- Ensure you're using the LATEST token from the current device
- Tokens can change if you clear browser data or reinstall

#### D. Firebase project configuration
- Verify the VAPID key in Firebase Console matches the one in `.env.local`:
  - Go to: Console → Project Settings → Cloud Messaging → Web Push certificates
  - The "Key pair" should start with: `BAAjN8hNnut8EgG9A9okszlzrmWC5_t7mhoB2QbCwn3Z...`

### Issue 4: iOS Safari limitations
**Important**: iOS Safari has restrictions on PWA notifications
- Notifications only work if app is "Add to Home Screen" (installed as PWA)
- Regular Safari tab notifications are very limited
- iOS 16.4+ required for web push notifications

**Solution for iOS**:
1. Open the app in Safari
2. Tap Share → "Add to Home Screen"
3. Open the PWA from home screen (not Safari)
4. Then enable notifications

## Debugging

### Check browser console logs
Enhanced logging is now active. Look for:
- 📱 User agent
- 🔔 Permission status
- 📝 SW registration
- 🔑 Token acquisition
- ❌ Any error messages

### Verify service worker registration
1. Open DevTools (if available on mobile)
2. Application tab → Service Workers
3. Should show: `/firebase-messaging-sw.js` as "activated"

### Test with desktop first
If mobile isn't working, test on desktop (Chrome/Edge) first:
1. Open: https://firebase-pwa-test--fir-project-b052b.asia-southeast1.hosted.app
2. Enable notifications
3. Send test message
4. If desktop works but mobile doesn't → likely mobile-specific issue (permissions, iOS limitations, etc.)

## Mobile Browser Recommendations

### Best support:
- ✅ Chrome for Android (full support)
- ✅ Samsung Internet (full support)
- ✅ Edge for Android (full support)

### Limited support:
- ⚠️ Safari for iOS (requires Add to Home Screen, iOS 16.4+)
- ⚠️ Firefox for Android (works but less tested)

### Not supported:
- ❌ In-app browsers (Instagram, Facebook, etc.)
- ❌ Private/Incognito mode

## Next Steps if Still Not Working

1. **Share the debug logs**: Copy the "Debug Logs" section shown in the app
2. **Check Firebase Console logs**: Console → Cloud Messaging → Reports
3. **Verify token is valid**: Try pasting token in a different testing tool
4. **Test another device**: Rule out device-specific issues

## Additional Notes

- Tokens expire/change when:
  - Browser data is cleared
  - App is uninstalled
  - User revokes notification permission
  - Firebase project credentials change

- Always use the most recent token for testing
- Notification delivery can take a few seconds (not instant)
- Check your device's internet connection
