import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
/** *.test / localhost URLs resolve to 127.0.0.1; optimizer blocks that unless this is set. */
const allowLocalImageUpstream =
    isDev || process.env.IMAGES_ALLOW_LOCAL_IP === "true";

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowLocalIP: allowLocalImageUpstream,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "http",
                hostname: "expense-tracker-backend.test",
            },
            {
                protocol: "https",
                hostname: "expense-tracker-backend.test",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
            },
        ],
    },
    /* config options here */
    env: {
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
};

export default nextConfig;
