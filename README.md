# BeaverX NFT

A simple ERC721 smart contract which lets users mint a limited BeaverX NFT and randomly chooses one minter who will win a certain amount of a project's ERC20 tokens.

## Overview

Motivated by the amazing community I found in the cryptosphere, I was looking for a way how to combine a small contribution to my 500 Twitter followers with my interest in learning more about web3 development. When I stumbled upon AI image creation with Stable Diffusion, I knew I had found a way to create something unique for my followers.

Countless times a beaver, which eventually came to be known as Dexter, had made its appearance on the community's Discord server. Not being blessed with any artsy abilities, but determined to create the perfect NFT embodiment of this community mascot (loved and cherished by many, hated and dreaded by some), I fiddled with the textual input to the Stable Diffusion algorithm until I created the cutest little beaver astronaut.

Thanks to the amazing tutorial on Solidity and Blockchain development by Patrick Collins, creating an NFT smart contract was pretty straightforward. All that was left to do to make this standard token model fit for my purposes was implement a simple mechanism which would transfer tokens from the contract to one randomly chosen minter. Luckily, I already knew about ChainlinkVRF, so I could readily implement this source of randomness for getting a verifiably random Token ID.

And that's basically how this contract works: Users will be able to mint exactly one NFT. The total number of NFTs which will ever be minted is 500. Once all those 500 NFTs have been minted, the ChainlinkVRF will be called to draw a random unique ID from all issued token IDs. The lucky owner of the drawn NFT will then receive all the StrikeX tokens the contract holds at this moment.

The only thing I am not entirely happy about is the solution I implemented to prevent StrikeX tokens to be stuck forever in the contract if somethings goes wrong during the raffle execution. I had to implement a function that only the owner of the contract will be able to call to withdraw all tokens from the contract. This is necessary to get back the tokens if for whatever reason a winner cannot be drawn, or the transfer of the prize pool to the winner fails. As it is, the function can be called at any time, so it would be possible to withdraw the prize so that the winner would receive nothing. In the context of a giveaway, this solution might still be acceptable, though a trust-less solution will be highly preferred and will be something I will consider for a v1.1.

Happy minting!

## Quickstart

### Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [nodeJS](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/getting-started/install)

### Getting started

```
git clone https://github.com/Ekii0/BeaverNFT.git
cd BeaverNFT
yarn
```

## Usage

### Running tests

```
yarn hardhat test
```

### Deploy

```
yarn hardhat deploy
```

## Author

ekiio
