const networkConfig = {
  31337: {
    name: "localhost",
    keyHash:
      "0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04",
    callbackGasLimit: "2500000",
    strx: "0xd6fDDe76B8C1C45B33790cc8751D5b88984c44ec",
  },
  5: {
    name: "goerli",
    keyHash:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "2500000",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    subscriptionId: "6227",
  },
  56: {
    name: "bsc",
    keyHash:
      "0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04",
    callbackGasLimit: "2500000",
    vrfCoordinatorV2: "0xc587d9053cd1118f25F645F9E08BB98c9712A4EE",
    subscriptionId: "1457",
    strx: "0xd6fDDe76B8C1C45B33790cc8751D5b88984c44ec",
  },
  97: {
    name: "testnet",
    keyHash:
      "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314",
    callbackGasLimit: "2500000",
    vrfCoordinatorV2: "0x6A2AAd07396B36Fe02a22b33cf443582f682c82f",
    subscriptionId: "1845",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
