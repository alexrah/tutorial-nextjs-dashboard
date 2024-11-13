/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental:{
    ppr: 'incremental',
    // staleTimes: {
    //   dynamic: 30
    // }
  }
};

export default nextConfig;
