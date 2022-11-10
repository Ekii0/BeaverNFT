const { network } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const BASE_FEE = "5000000000000000";
  const GAS_PRICE_LINK = 1e9;

  if (chainId === 31337) {
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      args: [BASE_FEE, GAS_PRICE_LINK],
      log: true,
      waitConfirmations: 1,
    });
    await deploy("StrikeX", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });
  }

  if (chainId === 5) {
    await deploy("StrikeX", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });
  }

  if (chainId === 97) {
    await deploy("StrikeX", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });
  }
};

module.exports.tags = ["all", "mocks"];
