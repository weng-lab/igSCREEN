/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/region/:region',
        destination: '/region/:region/icres',
        permanent: false
      },
      {
        source: '/region',
        destination: '/',
        permanent: false
      }
    ]
  }
}

export default nextConfig;
