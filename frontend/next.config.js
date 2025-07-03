/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.biography.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn*.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'instagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 