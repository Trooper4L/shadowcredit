import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "cofhe-hardhat-plugin";
import * as dotenv from "dotenv";
import "./tasks";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const ARB_SEPOLIA_RPC = process.env.ARB_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // cofhe-hardhat-plugin automatically injects mock CoFHE contracts
    },
    "arb-sepolia": {
      url: ARB_SEPOLIA_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 421614,
    },
  },
};

export default config;
