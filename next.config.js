/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add transpilePackages for @mediapipe
  transpilePackages: ['@mediapipe/tasks-vision']
}

module.exports = nextConfig