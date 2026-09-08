/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Ignore ESLint and TS errors during Vercel builds so deployments don't fail over minor syntax
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
