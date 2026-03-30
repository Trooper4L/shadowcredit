/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "porto": false,
      "porto/internal": false,
      "@safe-global/safe-apps-sdk": false,
      "@safe-global/safe-apps-provider": false,
      "@walletconnect/ethereum-provider": false,
      "@coinbase/wallet-sdk": false,
      "@metamask/connect-evm": false,
      "@base-org/account": false,
    };
    return config;
  },
};

export default nextConfig;
