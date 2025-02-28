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
        source: '/icre/:accession',
        destination: '/icre/:accession/activity',
        permanent: true
      },
      {
        source: '/snp/:rsID',
        destination: '/snp/:rsID/eQTLs',
        permanent: true
      },
    ]
  }
}

export default nextConfig;
