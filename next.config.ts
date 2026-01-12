import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    cacheComponents: true,
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: "plus.unsplash.com",
                protocol: "https",
                port: "",
            },
            {
                hostname: "curious-albatross-386.convex.cloud",
                protocol: "https",
                port: "",
            },
        ],
    },
};

export default nextConfig;
