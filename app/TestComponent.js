'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from './firebase';

export default function TestComponent() {
  const [token, setToken] = useState('');

  const handleRequestPermission = async () => {
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      setToken(fcmToken);
    }
  };

  useEffect(() => {
    onMessageListener().then((payload) => {
      console.log('Message received:', payload);
      alert(`${payload.notification.title}: ${payload.notification.body}`);
    }).catch(err => console.log('failed: ', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test</h1>
      <button onClick={handleRequestPermission}>
        Enable Notifications
      </button>
      {token && (
        <div style={{ marginTop: '10px', fontSize: '12px', wordBreak: 'break-all' }}>
          <strong>FCM Token:</strong> {token}
        </div>
      )}
    </div>
  );
}
