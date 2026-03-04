// Serves firebase-messaging-sw.js dynamically so env vars are injected at runtime.
// The browser requests /firebase-messaging-sw.js → this route handler serves the JS.

export const dynamic = 'force-dynamic';

export async function GET() {
  // Trim env vars to remove any trailing newlines from secret manager
  const apiKey = (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '').trim();
  const authDomain = (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '').trim();
  const projectId = (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '').trim();
  const storageBucket = (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '').trim();
  const messagingSenderId = (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '').trim();
  const appId = (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '').trim();
  const measurementId = (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '').trim();

  const swCode = `
console.log('[SW] firebase-messaging-sw.js loading...');

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

console.log('[SW] Firebase scripts loaded');

firebase.initializeApp({
  apiKey: "${apiKey}",
  authDomain: "${authDomain}",
  projectId: "${projectId}",
  storageBucket: "${storageBucket}",
  messagingSenderId: "${messagingSenderId}",
  appId: "${appId}",
  measurementId: "${measurementId}"
});

console.log('[SW] Firebase initialized with sender ID:', "${messagingSenderId}");

const messaging = firebase.messaging();
console.log('[SW] Firebase messaging instance created');

// Listen for ALL push events (not just Firebase ones)
self.addEventListener('push', (event) => {
  console.log('[SW] 🔔 RAW push event received!', event);
  
  let pushData = null;
  if (event.data) {
    try {
      pushData = event.data.json();
      console.log('[SW] Push data (JSON):', pushData);
    } catch (e) {
      pushData = event.data.text();
      console.log('[SW] Push data (text):', pushData);
    }
  } else {
    console.log('[SW] Push event has no data');
  }
  
  // Let Firebase handle it, but log that we saw it
  console.log('[SW] Delegating to Firebase messaging handlers...');
});

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 📩 onBackgroundMessage fired!', payload);
  console.log('[SW] Notification:', payload.notification);
  console.log('[SW] Data:', payload.data);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data,
    tag: 'fcm-notification-' + Date.now(),
    requireInteraction: true
  };

  console.log('[SW] Showing notification:', notificationTitle, notificationOptions);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Log when SW activates
self.addEventListener('activate', (event) => {
  console.log('[SW] 🟢 Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Log when SW installs
self.addEventListener('install', (event) => {
  console.log('[SW] 📦 Service worker installed');
  self.skipWaiting();
});

// Log notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 🖱️ Notification clicked:', event.notification.tag);
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('/')
  );
});

console.log('[SW] All event listeners registered');
`;

  return new Response(swCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
