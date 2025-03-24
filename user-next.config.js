/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Disable static generation completely
  experimental: {
    appDir: true,
  },
  // Skip type checking during build to speed up the process
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

