const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  publicExcludes: ['!firebase-messaging-sw.js'],
  buildExcludes: [/app-build-manifest\.json$/],
  manifestTransforms: [(manifest) => {
    // Filter out problematic app-build-manifest.json
    const transformedManifest = manifest.filter(
      entry => !entry.url.includes('app-build-manifest.json')
    );
    return { manifest: transformedManifest };
  }]
})

module.exports = withPWA({})
