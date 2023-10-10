/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: isProduction,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '79.175.157.194',
        port: '8400',
        pathname: '/**',
      },
    ],
  },
}

const plugins = []

module.exports = (phase, {defaultConfig}) => {
  return plugins.reduce((acc, plugin) => plugin(acc), {...nextConfig})
}
