'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Only register the main PWA service worker
      // Firebase SW will be registered when user enables notifications
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Main SW registered:', registration);
          setStatus('Main SW registered - Click Enable Notifications');
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
          setStatus('SW registration failed: ' + error.message);
        });
    } else {
      setStatus('Service Workers not supported');
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      padding: '10px',
      backgroundColor: '#333',
      color: 'white',
      fontSize: '12px',
      borderRadius: '4px',
      maxWidth: '300px'
    }}>
      SW Status: {status}
    </div>
  );
}
