/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'aromatic-robin-216.convex.cloud',
            },
            {
                hostname: 'lh3.googleusercontent.com',
            },
            {
                hostname: 'aromatic-robin-216.convex.site',
            },
        ],
    },
};

export default nextConfig;
