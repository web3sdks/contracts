<p align="center">
<br />
<a href="https://web3sdks.com"><img src="https://github.com/web3sdks/typescript-sdk/blob/main/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">web3sdks Contracts</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@web3sdks/contracts"><img src="https://img.shields.io/npm/v/@web3sdks/contracts?color=red&logo=npm" alt="npm version"/></a>
<a href="https://github.com/web3sdks/contracts/actions"><img alt="Build Status" src="https://github.com/web3sdks/contracts/actions/workflows/tests.yml/badge.svg"/></a>
<a href="https://discord.gg/n33UhsfUKB"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Collection of smart contracts deployable via the web3sdks SDK, dashboard and CLI</strong></p>
<br />

## Installation

```shell
npm i @web3sdks/contracts
```

## Running Tests

1. `yarn`: install contracts dependencies
2. `forge install`: install tests dependencies
3. `forge test`: run the tests

This repository is a hybrid [hardhat](https://hardhat.org/) and [forge](https://github.com/foundry-rs/foundry/tree/master/forge) project.

First install the relevant dependencies of the project:

```bash
yarn

forge install
```

To compile contracts, run:

```bash
forge build
```

Or, if you prefer hardhat, you can run:

```bash
npx hardhat compile
```

To run tests:

```bash
forge test
```

To export the ABIs of the contracts in the `/contracts` directory, run:

```
npx hardhat export-abi
```

To run any scripts in the `/scripts` directory, run:

```
npx hardhat run scripts/{path to the script}
```

## Pre-built Contracts

Pre-built contracts are written by the web3sdks team, and cover the most common use cases for smart contracts.

Release pages for pre-built contracts:

- [DropERC20](https://web3sdks.com/deployer.web3sdks.eth/DropERC20)
- [DropERC721](https://web3sdks.com/deployer.web3sdks.eth/DropERC721)
- [DropERC1155](https://web3sdks.com/deployer.web3sdks.eth/DropERC1155)
- [SignatureDrop](https://web3sdks.com/deployer.web3sdks.eth/SignatureDrop)
- [Marketplace](https://web3sdks.com/deployer.web3sdks.eth/Marketplace)
- [Multiwrap](https://web3sdks.com/deployer.web3sdks.eth/Multiwrap)
- [TokenERC20](https://web3sdks.com/deployer.web3sdks.eth/TokenERC20)
- [TokenERC721](https://web3sdks.com/deployer.web3sdks.eth/TokenERC721)
- [TokenERC1155](https://web3sdks.com/deployer.web3sdks.eth/TokenERC1155)
- [VoteERC20](https://web3sdks.com/deployer.web3sdks.eth/VoteERC20)
- [Split](https://web3sdks.com/deployer.web3sdks.eth/Split)

[Learn more about pre-built contracts](https://docs.web3sdks.com/pre-built-contracts)

## Extensions

Extensions are building blocks that help enrich smart contracts with features.

Some blocks come packaged together as Base Contracts, which come with a full set of features out of the box that you can modify and extend. These contracts are available at `contracts/base/`.

Other (smaller) blocks are Features, which provide a way for you to pick and choose which individual pieces you want to put into your contract; with full customization of how those features work. These are available at `contracts/extension/`.

[Learn more about extensions](https://docs.web3sdks.com/extensions)

## Deployments

The web3sdks registry (`TWRegistry`) and factory (`TWFactory`) have been deployed on the following chains:

- [Ethereum mainnet](https://etherscan.io/)
- [Rinkeby](https://rinkeby.etherscan.io/)
- [Goerli](https://goerli.etherscan.io/)
- [Polygon mainnet](https://polygonscan.com/)
- [Polygon Mumbai testnet](https://mumbai.polygonscan.com/)
- [Avalanche mainnet](https://snowtrace.io/)
- [Avalanche Fuji testnet](https://testnet.snowtrace.io/)
- [Fantom mainnet](https://ftmscan.com/)
- [Fantom testnet](https://testnet.ftmscan.com/)

`TWRegistry` is deployed to a common address on all mentioned networks. `TWFactory` is deployed to a common address on all mentioned networks except Fantom mainnet.

- `TWRegistry`: [0x7c487845f98938Bb955B1D5AD069d9a30e4131fd](https://blockscan.com/address/0x7c487845f98938Bb955B1D5AD069d9a30e4131fd)

- `TWFactory`: [0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0](https://blockscan.com/address/0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0)
- `TWFactory` (Fantom mainnet): [0x97EA0Fcc552D5A8Fb5e9101316AAd0D62Ea0876B](https://blockscan.com/address/0x97EA0Fcc552D5A8Fb5e9101316AAd0D62Ea0876B)


## Bug reports

Found a security issue with our smart contracts? Send bug reports to security@web3sdks.com and we'll continue communicating with you from there. We're actively developing a bug bounty program; bug report payouts happen on a case by case basis, for now.

## Feedback

If you have any feedback, please reach out to us at support@web3sdks.com.

## Authors

- [web3sdks](https://web3sdks.com)

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)
