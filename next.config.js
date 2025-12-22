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
    domains: [
      'localhost', 
      'api.shoptoolnro.com.vn', 
      'images.unsplash.com', 
      'cdn.vietqr.io', 
      'qr.sepay.vn'
    ],
  },
}

export default nextConfig
