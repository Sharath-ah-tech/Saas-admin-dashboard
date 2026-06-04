/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy all /api/* requests to Django during local dev.
  // This means the frontend never hits CORS issues locally —
  // every fetch to /api/... is forwarded to localhost:8000/api/...
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      // Also proxy social-auth routes (Google OAuth redirect)
      {
        source: "/login/:path*",
        destination: "http://localhost:8000/login/:path*",
      },
      {
        source: "/complete/:path*",
        destination: "http://localhost:8000/complete/:path*",
      },
    ];
  },
};

module.exports = nextConfig;