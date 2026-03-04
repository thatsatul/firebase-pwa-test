'use client';

export default function DebugPanel() {
  const checkSetup = async () => {
    const results = [];
    
    // Check if service worker is supported
    results.push(`✓ Service Worker API: ${('serviceWorker' in navigator) ? 'Supported' : 'Not Supported'}`);
    
    // Check if notifications are supported
    results.push(`✓ Notification API: ${('Notification' in window) ? 'Supported' : 'Not Supported'}`);
    
    // Check permission
    if ('Notification' in window) {
      results.push(`✓ Notification Permission: ${Notification.permission}`);
    }
    
    // Check registered service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      results.push(`✓ Service Workers Registered: ${registrations.length}`);
      registrations.forEach((reg, i) => {
        results.push(`  - SW ${i + 1}: ${reg.active?.scriptURL || 'pending'}`);
      });
    }
    
    alert(results.join('\n'));
    console.log('Debug Results:', results);
  };
  
  return (
    <button 
      onClick={checkSetup}
      style={{
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        marginLeft: '10px'
      }}
    >
      Debug Setup
    </button>
  );
}
