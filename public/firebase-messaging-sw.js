importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCm1L_qxgzNYO6xgXTt29vvkHx8k_cO_YE",
  authDomain: "fir-project-b052b.firebaseapp.com",
  projectId: "fir-project-b052b",
  storageBucket: "fir-project-b052b.firebasestorage.app",
  messagingSenderId: "360732639627",
  appId: "1:360732639627:web:9a40af7cce3b48c98cef8e",
  measurementId: "G-K25D5LCSWR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
