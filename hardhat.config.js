require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const TESTNET_DEPLOYER_KEY = process.env.TESTNET_DEPLOYER_KEY;
const TESTNET_TESTER_KEY = process.env.TESTNET_TESTER_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    bsc: {
      chainId: 56,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      url: QUICKNODE_RPC_URL || "",
      saveDeployments: true,
    },
    testnet: {
      chainId: 97,
      accounts: [TESTNET_DEPLOYER_KEY, TESTNET_TESTER_KEY],
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      saveDeployments: true,
    },
    goerli: {
      chainId: 5,
      accounts: [TESTNET_DEPLOYER_KEY],
      url: GOERLI_RPC_URL,
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: {
      bsc: BSCSCAN_API_KEY || "",
      testnet: BSCSCAN_API_KEY || "",
      goerli: ETHERSCAN_API_KEY || "",
    },
  },
  mocha: {
    timeout: 500000,
  },
};
