import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
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
