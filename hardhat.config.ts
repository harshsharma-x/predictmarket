import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY: string =
  process.env.PRIVATE_KEY ?? "0x" + "0".repeat(64);
const POLYGON_RPC: string =
  process.env.POLYGON_RPC_URL ?? "https://polygon-rpc.com";
const MUMBAI_RPC: string =
  process.env.MUMBAI_RPC_URL ?? "https://rpc-mumbai.maticvigil.com";
const POLYGONSCAN_API_KEY: string =
  process.env.POLYGONSCAN_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.34",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // ── Local ──────────────────────────────────────────────────────────────
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    hardhat: {
      chainId: 31337,
    },

    // ── Polygon Testnet ────────────────────────────────────────────────────
    mumbai: {
      url: MUMBAI_RPC,
      chainId: 80001,
      accounts: [PRIVATE_KEY],
      gasPrice: 20_000_000_000, // 20 gwei
    },

    // ── Polygon Mainnet ────────────────────────────────────────────────────
    polygon: {
      url: POLYGON_RPC,
      chainId: 137,
      accounts: [PRIVATE_KEY],
      gasPrice: 50_000_000_000, // 50 gwei
    },
  },

  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },

  paths: {
    sources:   "./contracts",
    tests:     "./test",
    cache:     "./cache",
    artifacts: "./artifacts",
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
