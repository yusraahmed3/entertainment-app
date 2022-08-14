/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGODB_URI:
      "mongodb+srv://yusraa190:menmeonly1@cluster1.zipapug.mongodb.net/users?retryWrites=true&w=majority",
    SECRET: "qwertyfb",
  },
};

module.exports = nextConfig;
