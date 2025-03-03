/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            fs: false
        }
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/region/:region',
        destination: '/region/:region/icres',
        permanent: true
      },
      {
        source: '/snp/:elementID',
        destination: '/snp/:elementID/eQTLs',
        permanent: true,
      },
      {
        source: '/icre/:elementID',
        destination: '/icre/:elementID/activity',
        permanent: true,
      },
      {
        source: '/gene/:elementID',
        destination: '/gene/:elementID/expression',
        permanent: true,
      },
    ]
  }
}

export default nextConfig;
