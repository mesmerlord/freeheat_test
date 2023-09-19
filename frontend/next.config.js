/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const moduleExports = {
  ...nextConfig,
  output: "standalone",
};
