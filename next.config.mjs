/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api"
        : "https://www.danameme.ch/api",
  },
};

export default nextConfig;
