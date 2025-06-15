import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Optional bundle analyzer
const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? (await import('@next/bundle-analyzer')).default({
        enabled: true,
      })
    : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },

  // MDX support
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error'],
          }
        : false,
  },

  // Image optimization (removed caching TTL)
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features for better performance
  experimental: {
    // optimizeCss: true, // Requires critters package - disabled for now
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // Security headers only
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Add any redirects you need here
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },

  // PoweredByHeader removal for security
  poweredByHeader: false,

  // Compression
  compress: true,

  // Output config for better performance
  output: 'standalone',
};

// Apply MDX plugin
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

// Export config with plugins applied
export default withBundleAnalyzer(withMDX(nextConfig));
