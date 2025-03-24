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
   // Add environment variables that should be available at build time
   env: {
    VERCEL_ENV: process.env.VERCEL_ENV || "development",
  },
}

module.exports = nextConfig

