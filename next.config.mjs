/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental:{
    // ppr: 'incremental',
    staleTimes: {
      dynamic: 30,
      static: 30
    }
  }
};

export default nextConfig;
