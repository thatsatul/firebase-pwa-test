import ServiceWorkerRegistration from './ServiceWorkerRegistration';

export const metadata = {
  title: 'PWA Test',
  description: 'Minimal PWA Test App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PWA Test'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4CAF50',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
