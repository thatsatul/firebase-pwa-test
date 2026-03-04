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
  if (!messaging) {
    console.error('❌ Messaging not initialized');
    return null;
  }
  
  try {
    console.log('📱 User agent:', navigator.userAgent);
    console.log('🔔 Requesting notification permission...');
    
    const permission = await Notification.requestPermission();
    console.log('✅ Notification permission:', permission);
    
    if (permission === 'granted') {
      // Register Firebase messaging service worker FIRST
      let firebaseRegistration;
      if ('serviceWorker' in navigator) {
        console.log('📝 Registering service worker...');
        firebaseRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Firebase SW registered:', firebaseRegistration.scope);
        
        // Wait for it to be active
        if (firebaseRegistration.installing) {
          console.log('⏳ Waiting for SW to activate...');
          await new Promise(resolve => {
            firebaseRegistration.installing.addEventListener('statechange', (e) => {
              console.log('SW state:', e.target.state);
              if (e.target.state === 'activated') resolve();
            });
          });
        }
        console.log('✅ SW is active');
      }
      
      // Get token with Firebase service worker
      console.log('🔑 Getting FCM token...');
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: firebaseRegistration
      });
      
      if (token) {
        console.log('✅ FCM Token obtained:', token);
      } else {
        console.warn('⚠️ FCM token is empty');
      }
      
      return token;
    } else {
      console.warn('⚠️ Notification permission not granted:', permission);
    }
  } catch (error) {
    console.error('❌ Notification permission error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
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
