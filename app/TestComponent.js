'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from './firebase';

export default function TestComponent() {
  const [token, setToken] = useState('');
  const [notification, setNotification] = useState(null);

  const handleRequestPermission = async () => {
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      setToken(fcmToken);
      alert('Notification permission granted! Token: ' + fcmToken.substring(0, 20) + '...');
    } else {
      alert('Notification permission denied or error occurred. Check console.');
    }
  };

  useEffect(() => {
    const setupListener = async () => {
      try {
        const payload = await onMessageListener();
        console.log('Foreground notification received:', payload);
        setNotification(payload.notification);
        
        // Show browser notification even in foreground
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/icon-192.png'
          });
        }
      } catch (err) {
        console.log('Listener error:', err);
      }
    };
    
    setupListener();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test</h1>
      <button 
        onClick={handleRequestPermission}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Enable Notifications
      </button>
      
      {token && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}>
          <strong>FCM Token:</strong>
          <div style={{ 
            fontSize: '12px', 
            wordBreak: 'break-all',
            marginTop: '5px',
            fontFamily: 'monospace'
          }}>
            {token}
          </div>
        </div>
      )}
      
      {notification && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          border: '1px solid #2196F3'
        }}>
          <strong>Last Notification:</strong>
          <div style={{ marginTop: '5px' }}>
            <strong>{notification.title}</strong>
            <p>{notification.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}
