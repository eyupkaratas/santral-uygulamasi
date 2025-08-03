import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/anasayfa",
        permanent: true,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
