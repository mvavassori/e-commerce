/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "iskaknozihhuhqaiqtlj.supabase.co",
                port: "",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
