import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
       {
        protocol: 'https',
        hostname: 'gifttree.com.pk',
      },
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL ? [{
        protocol: 'https' as const,
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
        pathname: '/storage/v1/object/public/**',
      }] : []),
    ],
  },
  /* config options here */
};

export default nextConfig;
