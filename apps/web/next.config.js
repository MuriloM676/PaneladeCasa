/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		const target = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
		return [
			{
				source: '/api/:path*',
				destination: `${target}/api/:path*`,
			},
			{
				source: '/uploads/:path*',
				destination: `${target}/uploads/:path*`,
			},
		];
	},
};

module.exports = nextConfig;
