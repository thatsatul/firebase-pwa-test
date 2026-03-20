'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FCMClickContent() {
  const searchParams = useSearchParams();
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    // Get any query parameters passed with the notification
    const data = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });
    
    if (Object.keys(data).length > 0) {
      setNotificationData(data);
    }

    // Log that user arrived via notification
    console.log('📬 User arrived via push notification click');
  }, [searchParams]);

  return (
    <>
      <div style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>🔔 Notification Opened!</h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          You clicked on a push notification
        </p>
      </div>

      {notificationData && Object.keys(notificationData).length > 0 && (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>📦 Notification Data:</h2>
          <pre style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px',
            margin: 0
          }}>
            {JSON.stringify(notificationData, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </a>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        border: '1px solid #2196F3'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💡 How it works:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
          <li>Push notifications are configured to open this page</li>
          <li>Any data sent with the notification is displayed above</li>
          <li>You can customize this page for your use case</li>
          <li>Analytics or tracking can be added here</li>
        </ul>
      </div>
    </>
  );
}

export default function FCMClickPage() {
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading notification data...</p>
        </div>
      }>
        <FCMClickContent />
      </Suspense>
    </div>
  );
}
