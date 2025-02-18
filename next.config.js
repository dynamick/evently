/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ["app.localhost:3000", "app.festivio.app"],
    },
  },
  images: {
    remotePatterns: [
      { hostname: "ltfhz55kkfvepvpt.public.blob.vercel-storage.com" },
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "www.google.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
    ],
  },
};
