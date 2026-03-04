'use client';

import { useState } from 'react';

export default function DiagnosticPanel() {
  const [results, setResults] = useState('');

  const runDiagnostics = async () => {
    let output = '=== FCM Push Notification Diagnostics ===\n\n';

    // 1. Check Notification API
    output += '1. Notification API:\n';
    output += `   Supported: ${'Notification' in window}\n`;
    output += `   Permission: ${Notification.permission}\n\n`;

    // 2. Check Service Worker
    output += '2. Service Worker API:\n';
    output += `   Supported: ${'serviceWorker' in navigator}\n`;
    
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      output += `   Registered: ${regs.length} service worker(s)\n`;
      
      for (let i = 0; i < regs.length; i++) {
        const reg = regs[i];
        output += `\n   SW ${i + 1}:\n`;
        output += `     Scope: ${reg.scope}\n`;
        output += `     Active: ${reg.active ? 'YES' : 'NO'}\n`;
        output += `     Script URL: ${reg.active?.scriptURL || 'N/A'}\n`;
        output += `     State: ${reg.active?.state || 'N/A'}\n`;
        
        // Check push subscription
        try {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            output += `     Push Subscription: EXISTS ✅\n`;
            output += `     Endpoint: ${sub.endpoint.substring(0, 60)}...\n`;
            
            // Parse endpoint to check provider
            if (sub.endpoint.includes('fcm.googleapis.com')) {
              output += `     Provider: Firebase Cloud Messaging ✅\n`;
            } else {
              output += `     Provider: ${new URL(sub.endpoint).hostname}\n`;
            }
            
            // Check keys
            const p256dh = sub.getKey('p256dh');
            const auth = sub.getKey('auth');
            output += `     Keys: p256dh=${p256dh ? 'YES' : 'NO'}, auth=${auth ? 'YES' : 'NO'}\n`;
          } else {
            output += `     Push Subscription: NONE ❌\n`;
            output += `     ⚠️ No push subscription found! This is why notifications aren't working.\n`;
          }
        } catch (e) {
          output += `     Push Subscription Error: ${e.message}\n`;
        }
      }
      
      // Check controller
      output += `\n   Controller: ${navigator.serviceWorker.controller ? navigator.serviceWorker.controller.scriptURL : 'NONE'}\n`;
    }
    output += '\n';

    // 3. Check browser info
    output += '3. Browser Info:\n';
    output += `   User Agent: ${navigator.userAgent}\n`;
    output += `   Online: ${navigator.onLine}\n`;
    output += `   Protocol: ${location.protocol}\n`;
    output += `   Host: ${location.host}\n\n`;

    // 4. Check Firebase config
    output += '4. Firebase Config:\n';
    output += `   API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET ✅' : 'MISSING ❌'}\n`;
    output += `   Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING'}\n`;
    output += `   Sender ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'MISSING'}\n`;
    output += `   App ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'SET ✅' : 'MISSING ❌'}\n`;
    output += `   VAPID Key: ${process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? 'SET ✅ (length: ' + process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY.length + ')' : 'MISSING ❌'}\n\n`;

    // 5. Chrome internals
    output += '5. Debugging Tools:\n';
    output += '   • Open chrome://gcm-internals/ to see FCM logs\n';
    output += '   • Open chrome://serviceworker-internals/ to inspect service workers\n';
    output += '   • Open DevTools → Application → Service Workers\n';
    output += '   • Open DevTools → Application → Manifest\n\n';

    // 6. Common issues
    output += '6. Common Issues:\n';
    output += '   ❌ No Push Subscription → Need to call getToken() with VAPID key\n';
    output += '   ❌ Wrong endpoint → Check VAPID key matches Firebase Console\n';
    output += '   ❌ SW not controlling page → Refresh or hard reload (Cmd+Shift+R)\n';
    output += '   ❌ Permission denied → Check browser site settings\n';
    output += '   ❌ Token but no messages → Check token in Firebase Console matches\n\n';

    output += '=== End Diagnostics ===\n';
    
    setResults(output);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results);
    alert('Diagnostics copied to clipboard!');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button 
        onClick={runDiagnostics}
        style={{
          padding: '10px 20px',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginRight: '10px'
        }}
      >
        Run Full Diagnostics
      </button>
      
      {results && (
        <>
          <button 
            onClick={copyResults}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Copy Results
          </button>
          
          <pre style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#1e1e1e',
            color: '#ddd',
            borderRadius: 4,
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
            maxHeight: 500,
            whiteSpace: 'pre-wrap'
          }}>
            {results}
          </pre>
        </>
      )}
    </div>
  );
}
