/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui', 'lucide-react'],
  },
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig
