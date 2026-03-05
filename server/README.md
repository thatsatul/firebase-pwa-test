# FCM v1 API Setup

## 1. Get Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `server/placeholders/service-account.json`

## 2. Usage

### Option A: API Server
```bash
npm run fcm-server
```
Then POST to `http://localhost:3001/send-notification`:
```json
{
  "token": "FCM_TOKEN_HERE",
  "title": "Test Title",
  "body": "Test Message",
  "data": { "key": "value" }
}
```

### Option B: Direct Script
Edit `server/test-send.js` with your FCM token, then:
```bash
npm run test-send
```

## Files Created
- `server/fcm-sender.js` - Core FCM v1 API logic
- `server/index.js` - Express API server
- `server/test-send.js` - Quick test script
- `server/placeholders/service-account.json` - Add your Firebase service account here
