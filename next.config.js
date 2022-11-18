/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google'},
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Add any logic you want here, returning `true` to enable password protect.
    PASSWORD_PROTECT: process.env.ENVIRONMENT === 'staging',
  }
}

module.exports = nextConfig
