const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    const key = require('../certificates/fir-project-b052b-firebase-adminsdk-c903q-3b0457675c.json');
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

async function sendPushNotification(token, title, body, data = {}) {
  try {
    const accessToken = await getAccessToken();
    const projectId = 'fir-project-b052b';
    
    const message = {
      message: {
        token: token,
        notification: {
          title: title,
          body: body
        },
        data: data,
        webpush: {
          fcm_options: {
            link: '/'
          }
        }
      }
    };

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`FCM API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log('✅ Notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    throw error;
  }
}

module.exports = {
  getAccessToken,
  sendPushNotification
};
