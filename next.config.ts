import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const protocol = supabaseUrl.protocol === "https:" ? "https" : "http";

  remotePatterns.push({
    protocol,
    hostname: supabaseUrl.hostname,
    port: supabaseUrl.port,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
