import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },
  // Image domains for medical app
  images: {
    domains: ['localhost', 'api.medcore.app', 'storage.medcore.app'],
    formats: ['image/webp', 'image/avif'],
  },
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/',
        destination: '/id',
        permanent: false,
      },
    ]
  },
};

export default withNextIntl(nextConfig);
