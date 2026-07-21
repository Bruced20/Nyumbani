import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Curated royalty-free property photography is served from Unsplash and
    // Pexels. `search` is intentionally omitted so their query strings
    // (?w=, ?auto=) are allowed. Supabase Storage is included for any
    // user-uploaded property images.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
}

export default nextConfig
