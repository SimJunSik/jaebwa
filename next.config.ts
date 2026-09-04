import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // www 는 apex 로 넘긴다. 두 호스트가 같은 내용을 200 으로 서빙하면 중복이 된다.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.jaebwa.com" }],
        destination: "https://jaebwa.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
