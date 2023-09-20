/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: isProduction,
  },
}

const plugins = []

module.exports = (phase, {defaultConfig}) => {
  return plugins.reduce((acc, plugin) => plugin(acc), {...nextConfig})
}
