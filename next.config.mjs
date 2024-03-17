/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'aromatic-robin-216.convex.cloud',
            },
        ],
    },
};

export default nextConfig;
