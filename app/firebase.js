import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCm1L_qxgzNYO6xgXTt29vvkHx8k_cO_YE",
  authDomain: "fir-project-b052b.firebaseapp.com",
  projectId: "fir-project-b052b",
  storageBucket: "fir-project-b052b.firebasestorage.app",
  messagingSenderId: "360732639627",
  appId: "1:360732639627:web:9a40af7cce3b48c98cef8e",
  measurementId: "G-K25D5LCSWR"
};

const app = initializeApp(firebaseConfig);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BAAjN8hNnut8EgG9A9okszlzrmWC5_t7mhoB2QbCwn3ZD0sPFVI9MrTiVGUHGOL5FmoVRZ2sMhcT7AswlnWawMQ'
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
