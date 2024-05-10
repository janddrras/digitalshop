/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				port: "3000",
				hostname: "localhost",
			},
			// {
			// 	protocol: "https",
			// 	hostname: "digitalhippo-production.up.railway.app",
			// },
		],
	},
}

export default nextConfig
