/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Serve the images/ folder as additional static files
  async rewrites() {
    return [
      {
        source: '/logo.png',
        destination: '/images/logo.png',
      },
    ];
  },
};

export default nextConfig;
