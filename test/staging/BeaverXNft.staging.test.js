const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("BeaverXNft Staging Tests", function () {
      let deployer, beaverX, strx;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        beaverX = await ethers.getContract("BeaverXNft", deployer);
        strx = await ethers.getContract("StrikeX", deployer);
      });
      describe("fulfillRandomWords", function () {
        it("correctly mints NFTs and works with a live ChainlinkVRF to get a random winner", async function () {
          const accounts = await ethers.getSigners();
          const minter1 = accounts[0];
          const minter2 = accounts[1];
          await strx.mint(
            beaverX.address,
            ethers.utils.parseUnits("10000", 18)
          );

          await new Promise(async (resolve, reject) => {
            beaverX.once("WinnerDrawn", async () => {
              console.log("WinnerDrawn Event fired!");
              try {
                const minter1Nfts = await beaverX.balanceOf(minter1.address);
                const minter2Nfts = await beaverX.balanceOf(minter2.address);
                const contractBalance = await strx.balanceOf(beaverX.address);
                const minter1Balance = await strx.balanceOf(minter1.address);
                const minter2Balance = await strx.balanceOf(minter2.address);
                assert.equal(minter1Nfts, 1);
                assert.equal(minter2Nfts, 1);
                assert.equal(contractBalance, 0);
                if (ethers.utils.formatUnits(minter1Balance, 18) > 0) {
                  assert.equal(
                    ethers.utils.formatUnits(minter1Balance, 18),
                    "10000.0"
                  );
                } else {
                  assert.equal(
                    ethers.utils.formatUnits(minter2Balance, 18),
                    "10000.0"
                  );
                }
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });
            console.log("Minting Nfts...");
            await beaverX.connect(minter1).mintNft();
            await beaverX.connect(minter2).mintNft();
          });
        });
      });
    });
