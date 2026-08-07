import type { NextConfig } from "next";

const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath,
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  /* `experimental.serverActions.bodySizeLimit: "30mb"` sat here, commented
     "Quote requests may carry print-ready PDF/AI artwork." It did nothing.
     bodySizeLimit applies only to Server Actions, and there is not one
     `"use server"` in this codebase — artwork goes through a route handler.
     The real ceiling on an upload is nginx's `client_max_body_size 30m` in
     both deploy scripts, plus the route's own 25MB-per-file check. Removed
     because a config line that implies a capability nobody wired is worse
     than no line: the next person raises this number and wonders why the
     413 does not move. */
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
