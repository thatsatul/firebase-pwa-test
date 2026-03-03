importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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
  console.log('Background Message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
