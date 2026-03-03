const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest\.json$/],
  manifestTransforms: [(manifest) => {
    const transformedManifest = manifest.filter(
      entry => !entry.url.includes('app-build-manifest.json')
    );
    return { manifest: transformedManifest };
  }]
})

module.exports = withPWA({
  // No env block needed — NEXT_PUBLIC_* vars are auto-inlined by Next.js
})