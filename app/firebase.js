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

let app;
let messaging = null;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      // Register Firebase messaging service worker FIRST
      let firebaseRegistration;
      if ('serviceWorker' in navigator) {
        firebaseRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Firebase SW registered:', firebaseRegistration);
        
        // Wait for it to be active
        if (firebaseRegistration.installing) {
          await new Promise(resolve => {
            firebaseRegistration.installing.addEventListener('statechange', (e) => {
              if (e.target.state === 'activated') resolve();
            });
          });
        }
      }
      
      // Get token with Firebase service worker
      const token = await getToken(messaging, {
        vapidKey: 'BAAjN8hNnut8EgG9A9okszlzrmWC5_t7mhoB2QbCwn3ZD0sPFVI9MrTiVGUHGOL5FmoVRZ2sMhcT7AswlnWawMQ',
        serviceWorkerRegistration: firebaseRegistration
      });
      console.log('FCM Token obtained:', token);
      
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
        console.log('Foreground message received:', payload);
        resolve(payload);
      });
    }
  });
