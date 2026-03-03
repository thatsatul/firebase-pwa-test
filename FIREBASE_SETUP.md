# Firebase Configuration

Replace the placeholders in these files with your actual Firebase project credentials:

## Files to update:
1. `app/firebase.js`
2. `public/firebase-messaging-sw.js`

## Get your Firebase config:
1. Go to Firebase Console: https://console.firebase.google.com/
2. Create a new project or select existing one
3. Go to Project Settings (gear icon)
4. Under "Your apps" → Web app → SDK setup and configuration
5. Copy the config values

## Get VAPID Key:
1. In Firebase Console → Project Settings
2. Go to "Cloud Messaging" tab
3. Under "Web Push certificates" → Generate key pair
4. Copy the VAPID key

## Replace these values:
- `YOUR_API_KEY`
- `YOUR_PROJECT_ID` 
- `YOUR_SENDER_ID`
- `YOUR_APP_ID`
- `YOUR_VAPID_KEY`
