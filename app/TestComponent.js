'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from './firebase';
import DebugPanel from './DebugPanel';
import DiagnosticPanel from './DiagnosticPanel';

export default function TestComponent() {
  const [token, setToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
    console.log(msg);
  };

  const handleRequestPermission = async () => {
    addLog('🔔 Starting notification permission request...');
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      setToken(fcmToken);
      addLog(`✅ Token obtained: ${fcmToken.substring(0, 30)}...`);
      alert('Notification permission granted! Token copied to clipboard.');
      // Auto-copy to clipboard on mobile
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(fcmToken);
          addLog('📋 Token copied to clipboard');
        } catch (e) {
          addLog('⚠️ Could not copy to clipboard');
        }
      }
    } else {
      addLog('❌ Permission denied or error occurred');
      alert('Notification permission denied or error occurred. Check logs below.');
    }
  };

  // Auto-request FCM token on page load
  useEffect(() => {
    const autoRequestToken = async () => {
      addLog('🔄 Auto-requesting FCM token on page load...');
      
      // Check if notification permission is already granted
      if (Notification.permission === 'granted') {
        addLog('✅ Notification permission already granted, getting token...');
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
          setToken(fcmToken);
          addLog(`✅ Token obtained: ${fcmToken.substring(0, 30)}...`);
          // Auto-copy to clipboard
          if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(fcmToken);
              addLog('📋 Token copied to clipboard');
            } catch (e) {
              addLog('⚠️ Could not copy to clipboard');
            }
          }
        }
      } else if (Notification.permission === 'default') {
        addLog('⚠️ Notification permission not yet granted. Click "Enable Notifications" button.');
      } else {
        addLog('❌ Notification permission denied');
      }
    };
    
    autoRequestToken();
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      try {
        console.log('Setting up foreground message listener...');
        const payload = await onMessageListener();
        console.log('✅ Foreground notification received:', payload);
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


  const gcmConnectionHelper = () => {
    return <>
      {/* GCM Connection Helper */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔧 GCM Connection Fix</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#856404' }}>
          If notifications aren't working and chrome://gcm-internals shows "CONNECTING":
        </p>
        <ol style={{ margin: '0 0 10px 0', paddingLeft: '20px', fontSize: '13px', color: '#856404' }}>
          <li>Click button below to check connection state</li>
          <li>If "Connection State: CONNECTING" → Close ALL Chrome windows (Cmd+Q)</li>
          <li>Wait 10 seconds, reopen Chrome</li>
          <li>Check again - should show "CONNECTED"</li>
        </ol>
        <button
          onClick={() => {
            window.open('chrome://gcm-internals', '_blank');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ffc107',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Open chrome://gcm-internals
        </button>
      </div>
      
      {/* Logs section for debugging */}
      {logs.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#1e1e1e',
          color: '#ddd',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <strong style={{ color: '#4CAF50' }}>Debug Logs:</strong>
          {logs.map((log, i) => (
            <div key={i} style={{ marginTop: '5px' }}>{log}</div>
          ))}
        </div>
      )}
    </>
  }

  const enableNotifications = () => {
    return <div>
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
      {/* <DebugPanel /> */}
    </div>;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test</h1>

      {enableNotifications()}
      {/* <DiagnosticPanel /> */}
      
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
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Copy this token and use it in Firebase Console → Cloud Messaging → Send test message
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
      {/* {gcmConnectionHelper()} */}
    </div>
  );
}
