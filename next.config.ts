import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production'

// IMPORTANT: Before deploying to GitHub Pages, you should replace 'lift-dashboard'
// with the name of your GitHub repository if it is different.
const repoName = 'lift-dashboard'; 

const nextConfig: NextConfig = {
  /**
   * Enable static exports for the App Router.
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /**
   * Set base path and asset prefix for GitHub Pages.
   * These are only set in production to avoid breaking local development.
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: isProd ? `/${repoName}` : undefined,
  assetPrefix: isProd ? `/${repoName}/` : undefined,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    /**
     * Disable Image Optimization since it is not supported with `output: 'export'`.
     * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
     */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
