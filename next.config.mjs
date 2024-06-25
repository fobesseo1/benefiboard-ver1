/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Strict Mode 비활성화
  experimental: {
    optimizeCss: true, // 이 설정을 추가하여 CSS 최적화를 활성화합니다.
  },
};

export default nextConfig;
