const express = require('express');
const { sendPushNotification } = require('./fcm-sender');

const app = express();

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

const userFcmMapping = {}; // In-memory mapping of userId to FCM token (replace with DB in production)

app.post('/send-notification', async (req, res) => {
  try {
    const { userId, title, body, data, clickUrl } = req.body;

    let tokens = [];
    console.log(`Searching for FCM tokens for userId: ${userId}`, userFcmMapping);
    Object.keys(userFcmMapping).forEach(key => {
      if (userFcmMapping[key] === userId) {
        tokens.push(key);
      }
    });
    if (tokens.length === 0) {
      return res.status(404).json({
        error: 'FCM token not found for userId: ' + userId
      });
    }
    console.log(`FCM token found for user ${userId}: ${tokens}`);

    if (!title || !body) {
      return res.status(400).json({
        error: 'Missing required fields: title, body'
      });
    }

    const promises = tokens.map(token => {
      let finalTitle = userId + ' (' + token.substring(0, 6) + '): ' + title;
      return sendPushNotification(token, finalTitle, body, data, clickUrl);
    });

    await Promise.all(promises);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

app.post('/map-user-fcm', async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({
        error: 'Missing required fields: userId, fcmToken'
      });
    }

    console.log(`Mapping user ${userId} to FCM token ${fcmToken}`);
    userFcmMapping[fcmToken] = userId;

    // Here you would typically map the userId to the fcmToken in your database
    // For demonstration, we'll just return a success message
    res.json({ success: true, message: `User ${userId} mapped to FCM token ${fcmToken}` });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 FCM Server running on http://localhost:${PORT}`);
  console.log(`📬 Send POST to http://localhost:${PORT}/send-notification`);
  console.log(`   Body: { "token": "FCM_TOKEN", "title": "Title", "body": "Message" }`);
});
