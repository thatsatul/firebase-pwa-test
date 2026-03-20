const express = require('express');
const { sendPushNotification } = require('./fcm-sender');

const app = express();
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  try {
    const { token, title, body, data, clickUrl } = req.body;
    
    if (!token || !title || !body) {
      return res.status(400).json({ 
        error: 'Missing required fields: token, title, body' 
      });
    }

    const result = await sendPushNotification(token, title, body, data, clickUrl);
    res.json({ success: true, result });
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
