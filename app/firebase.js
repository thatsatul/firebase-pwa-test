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
      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker ready:', registration);
      
      // Register Firebase messaging with the existing service worker
      const token = await getToken(messaging, {
        vapidKey: 'BAAjN8hNnut8EgG9A9okszlzrmWC5_t7mhoB2QbCwn3ZD0sPFVI9MrTiVGUHGOL5FmoVRZ2sMhcT7AswlnWawMQ',
        serviceWorkerRegistration: registration
      });
      console.log('FCM Token:', token);
      
      // Also register the Firebase messaging service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-cloud-messaging-push-scope'
        }).then((reg) => {
          console.log('Firebase SW registered separately:', reg);
        }).catch((err) => {
          console.log('Firebase SW registration failed:', err);
        });
      }
      
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
