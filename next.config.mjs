import { withContentCollections } from "@content-collections/next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
