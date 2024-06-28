module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/:path*",
        has: [{ type: "cookie", key: "role", value: "MANAGER" }],
        permanent: false,
        destination: "/403",
      },
      {
        source: "/manager/:path*",
        has: [{ type: "cookie", key: "role", value: "ADMIN" }],
        permanent: false,
        destination: "/403",
      },
    ];
  },
};
