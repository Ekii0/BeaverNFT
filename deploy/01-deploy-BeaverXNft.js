const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

const AMOUNT = ethers.utils.parseEther("1");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let vrfCoordinatorV2Address,
    strxAddress,
    subscriptionId,
    maxSupply,
    vrfCoordinatorV2Mock;
  const chainId = network.config.chainId;
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  if (chainId === 31337) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    strxAddress = (await ethers.getContract("StrikeX")).address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, AMOUNT);
    maxSupply = 2;
  } else if (chainId === 97) {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    strxAddress = (await ethers.getContract("StrikeX")).address;
    subscriptionId = networkConfig[chainId].subscriptionId;
    maxSupply = 2;
  } else if (chainId === 5) {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    strxAddress = (await ethers.getContract("StrikeX")).address;
    subscriptionId = networkConfig[chainId].subscriptionId;
    maxSupply = 10;
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    strxAddress = networkConfig[chainId].strx;
    subscriptionId = networkConfig[chainId].subscriptionId;
    maxSupply = 500;
  }

  const arguments = [
    strxAddress,
    maxSupply,
    vrfCoordinatorV2Address,
    networkConfig[chainId].keyHash,
    subscriptionId,
    networkConfig[chainId].callbackGasLimit,
  ];

  const beaverX = await deploy("BeaverXNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  if (chainId == 31337) {
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, beaverX.address);
  }

  if (
    !developmentChains.includes(network.name) &&
    process.env.BSCSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(beaverX.address, arguments);
  }
};

module.exports.tags = ["all", "nft"];
