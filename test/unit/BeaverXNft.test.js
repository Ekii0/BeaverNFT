const { expect, assert } = require("chai");
const { deployments, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BeaverX NFT", function () {
      let vrfCoordinatorV2Mock, beaverX, accounts, deployer, minter;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        minter = accounts[1];
        await deployments.fixture(["mocks", "nft"]);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        beaverX = await ethers.getContract("BeaverXNft");
      });

      describe("constructor", () => {
        it("sets initial values correctly", async function () {
          const name = await beaverX.name();
          const symbol = await beaverX.symbol();
          assert.equal(name, "BeaverX");
          assert.equal(symbol, "BVX");
        });
      });

      describe("mintNft", () => {
        it("successfully mints an NFT", async function () {
          await beaverX.connect(minter).mintNft();
          const balance = await beaverX.balanceOf(minter.address);
          assert.equal(balance, 1);
          const tokenURI = await beaverX.tokenURI("0");
          assert.equal(tokenURI.toString().includes("json;base64"), true);
        });
        it("increases tokenId after minting", async function () {
          startId = await beaverX.getTokenId();
          assert.equal(startId, 0);
          await beaverX.connect(minter).mintNft();
          endId = await beaverX.getTokenId();
          assert.equal(endId, 1);
        });
        it("reverts if one account tries to mint twice", async function () {
          beaverX.connect(minter).mintNft();
          expect(
            beaverX.connect(minter).mintNft()
          ).to.be.revertedWithCustomError(
            beaverX,
            "BeaverXNft__AlreadyMintedYourNft"
          );
        });
        it("reverts if all NFTs have already been minted", async function () {
          const latecomer = accounts[2];
          const strx = await ethers.getContract("StrikeX");
          await strx.mint(
            beaverX.address,
            ethers.utils.parseUnits("10000", 18)
          );
          await beaverX.connect(deployer).mintNft();
          await beaverX.connect(minter).mintNft();
          expect(
            beaverX.connect(latecomer).mintNft()
          ).to.be.revertedWithCustomError(
            beaverX,
            "BeaverXNft__AllNftsAlreadyMinted"
          );
        });
      });

      describe("withdrawToOwner", () => {
        it("withdraws all Tokens from the contract", async function () {
          const strx = await ethers.getContract("StrikeX");
          await strx.mint(
            beaverX.address,
            ethers.utils.parseUnits("10000", 18)
          );
          const contractStartingBalance = await strx.balanceOf(beaverX.address);
          const ownerStartingBalance = await strx.balanceOf(deployer.address);
          assert.equal(
            contractStartingBalance.toString(),
            ethers.utils.parseUnits("10000", 18)
          );
          await beaverX.withdrawToOwner();
          const contractEndingBalance = await strx.balanceOf(beaverX.address);
          const ownerEndingBalance = await strx.balanceOf(deployer.address);
          assert.equal(contractEndingBalance, 0);
          assert.equal(
            ownerEndingBalance.sub(ownerStartingBalance).toString(),
            ethers.utils.parseUnits("10000", 18)
          );
        });
        it("reverts when called from non-owner account", async function () {
          expect(
            beaverX.connect(minter).withdrawToOwner()
          ).to.be.revertedWithCustomError(beaverX, "BeaverXNft__NotOwner");
        });
      });

      describe("fulfillRandomWords", () => {
        it("sends STRX after the final NFT was minted", async function () {
          const minter2 = accounts[2];
          const strx = await ethers.getContract("StrikeX");

          await strx.mint(
            beaverX.address,
            ethers.utils.parseUnits("10000", 18)
          );

          await new Promise(async (resolve, reject) => {
            beaverX.once("WinnerDrawn", async () => {
              try {
                const endingBalance = await strx.balanceOf(beaverX.address);
                const winnerBalance = await strx.balanceOf(minter2.address);
                assert.equal(endingBalance, 0);
                assert.equal(
                  winnerBalance.toString(),
                  ethers.utils.parseUnits("10000", 18)
                );
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });
            try {
              await beaverX.connect(minter).mintNft();
              const transactionResponse = await beaverX
                .connect(minter2)
                .mintNft();
              const transactionReceipt = await transactionResponse.wait(1);

              const mockResponse = await vrfCoordinatorV2Mock
                .connect(minter2)
                .fulfillRandomWordsWithOverride(
                  ethers.BigNumber.from(1),
                  beaverX.address,
                  [ethers.BigNumber.from(1)]
                );
              const mockReceipt = mockResponse.wait(1);
            } catch (e) {
              console.log(e);
              reject(e);
            }
          });
        });
      });
    });
