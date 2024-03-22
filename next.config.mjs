/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
