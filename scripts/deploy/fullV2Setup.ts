import hre, { ethers } from "hardhat";

import {
  DropERC1155,
  DropERC20,
  DropERC721,
  Marketplace,
  Multiwrap,
  SignatureDrop,
  Split,
  TokenERC1155,
  TokenERC20,
  TokenERC721,
  TWFee,
  VoteERC20,
} from "typechain";
import { nativeTokenWrapper } from "../../utils/nativeTokenWrapper";

async function verify(address: string, args: any[]) {
  try {
    return await hre.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(address, args, e);
  }
}

async function main() {
  // Deploy FeeType
  const options = {
    //maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    //maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    //gasPrice: ethers.utils.parseUnits("100", "gwei"),
    gasLimit: 5_000_000,
  };

  const trustedForwarder = await (await ethers.getContractFactory("Forwarder")).deploy(options);
  // const trustedForwarder = await ethers.getContractAt("Forwarder", "0x5D1021751de591fEd8562eE92731F6D612D4cC81");
  console.log("Deploying Trusted Forwarder at tx: ", trustedForwarder.deployTransaction?.hash);
  await trustedForwarder.deployed();
  console.log("Trusted Forwarder address: ", trustedForwarder.address);
  const trustedForwarderAddress: string = trustedForwarder.address;

  // Deploy TWRegistry
  const web3sdksRegistry = await (
    await ethers.getContractFactory("TWRegistry")
  ).deploy(trustedForwarderAddress, options);
  // const web3sdksRegistry = await ethers.getContractAt("TWRegistry", "0xB161f6EA00A3008F20a32d465E5364B0905A33Ad");
  console.log("Deploying TWRegistry at tx: ", web3sdksRegistry.deployTransaction?.hash);
  await web3sdksRegistry.deployed();
  console.log("TWRegistry address: ", web3sdksRegistry.address);

  // Deploy TWFactory and TWRegistry
  const web3sdksFactory = await (
    await ethers.getContractFactory("TWFactory")
  ).deploy(trustedForwarderAddress, web3sdksRegistry.address, options);
  // const web3sdksFactory = await ethers.getContractAt("TWFactory", "0x80a1d6255191D2Af220a35640F393de5B6266f02");
  console.log("Deploying TWFactory at tx: ", web3sdksFactory.deployTransaction?.hash);
  await web3sdksFactory.deployed();
  console.log("TWFactory address: ", web3sdksFactory.address);

  // Deploy TWFee
  const web3sdksFee: TWFee = await ethers
    .getContractFactory("TWFee")
    .then(f => f.deploy(trustedForwarderAddress, web3sdksFactory.address, options));
  // const web3sdksFee = await ethers.getContractAt("TWFee", "0x2d484d217F3CF9C0AF4E4bE27825B946B0F1049F");
  console.log("Deploying TWFee at tx: ", web3sdksFee.deployTransaction?.hash);
  await web3sdksFee.deployed();
  console.log("TWFee address: ", web3sdksFee.address);

  // Deploy a test implementation: Drop721
  const drop721: DropERC721 = await ethers
    .getContractFactory("DropERC721")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  // const drop721 = await ethers.getContractAt("DropERC721", "0x20e099109dbEbBD11058EeB39417B2eCA52C83f0");
  console.log("Deploying DropERC721 at tx: ", drop721.deployTransaction?.hash);
  console.log("DropERC721 address: ", drop721.address);

  // Deploy a test implementation: Drop1155
  const drop1155: DropERC1155 = await ethers
    .getContractFactory("DropERC1155")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying Drop1155 at tx: ", drop1155.deployTransaction.hash);
  console.log("Drop1155 address: ", drop1155.address);
  // const drop1155 = await ethers.getContractAt("DropERC1155", "0xEE89E8E54271F30738883e28DD7f8226805a6848");

  // Deploy a test implementation: DropERC20
  const drop20: DropERC20 = await ethers
    .getContractFactory("DropERC20")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying DropERC20 at tx: ", drop20.deployTransaction.hash);
  console.log("DropERC20 address: ", drop20.address);
  // const drop20 = await ethers.getContractAt("DropERC20", "0x5Abe68be6ecE6586Bd438BE25cEed2D5707F2a95");

  // Deploy a test implementation: TokenERC20
  const tokenERC20: TokenERC20 = await ethers
    .getContractFactory("TokenERC20")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying TokenERC20 at tx: ", tokenERC20.deployTransaction.hash);
  console.log("TokenERC20 address: ", tokenERC20.address);
  // const tokenERC20 = await ethers.getContractAt("TokenERC20", "0x07Fd3DAdf1f81BfA0ab0841c33e44789E78335F0");

  // Deploy a test implementation: TokenERC721
  const tokenERC721: TokenERC721 = await ethers
    .getContractFactory("TokenERC721")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying TokenERC721 at tx: ", tokenERC721.deployTransaction.hash);
  console.log("TokenERC721 address: ", tokenERC721.address);
  // const tokenERC721 = await ethers.getContractAt("TokenERC721", "0x2F7f4Ac01119F8F99B94F0927EfA27D7818A074b");

  // Deploy a test implementation: TokenERC1155
  const tokenERC1155: TokenERC1155 = await ethers
    .getContractFactory("TokenERC1155")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying TokenERC1155 at tx: ", tokenERC1155.deployTransaction.hash);
  console.log("TokenERC1155 address: ", tokenERC1155.address);
  // const tokenERC1155 = await ethers.getContractAt("TokenERC1155", "0x436bC195D4BFFD9aA0DfB20688737cF7D7Ab3e35");

  const split: Split = await ethers
    .getContractFactory("Split")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying Split at tx: ", split.deployTransaction.hash);
  console.log("Split address: ", split.address);
  // const split = await ethers.getContractAt("Split", "0xC5a73A3794423CB30029ab5c6d0acb22f6CcCDA2");

  const marketplace: Marketplace = await ethers
    .getContractFactory("Marketplace")
    .then(f => f.deploy(nativeTokenWrapper[ethers.provider.network.chainId], options))
    .then(f => f.deployed());
  console.log("Deploying Marketplace at tx: ", marketplace.deployTransaction.hash);
  console.log("Marketplace address: ", marketplace.address);
  // const marketplace = await ethers.getContractAt("Marketplace", "0x28F97d65F66F5D4f152e9A46Cf3D6DF22307e86d");

  const vote: VoteERC20 = await ethers
    .getContractFactory("VoteERC20")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying vote at tx: ", vote.deployTransaction.hash);
  console.log("Vote address: ", vote.address);
  // const vote = await ethers.getContractAt("VoteERC20", "0x73ab01d8Eeb0Ac0C012BC1ca20d5A0494C38a376");

  // Multiwrap
  const multiwrap: Multiwrap = await ethers
    .getContractFactory("Multiwrap")
    .then(f => f.deploy(nativeTokenWrapper[ethers.provider.network.chainId], options))
    .then(f => f.deployed());
  console.log("Deploying Multiwrap at tx: ", multiwrap.deployTransaction.hash);
  console.log("Multiwrap address: ", multiwrap.address);
  // const multiwrap = await ethers.getContractAt("Multiwrap", "0x831e2B04c4aF9a3759C5D8FeA49692e8a0294B01");

  // Signature Drop
  const sigdrop: SignatureDrop = await ethers
    .getContractFactory("SignatureDrop")
    .then(f => f.deploy(options))
    .then(f => f.deployed());
  console.log("Deploying SignatureDrop at tx: ", sigdrop.deployTransaction.hash);
  console.log("SignatureDrop address: ", sigdrop.address);
  // const sigdrop = await ethers.getContractAt("SignatureDrop", "0xFDb9cc34BfA6a51e96F73f0a828717A6dfA460E8");

  // TODO Pack

  const tx = await web3sdksFactory.multicall(
    [
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [drop721.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [drop1155.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [drop20.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [tokenERC20.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [tokenERC721.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [tokenERC1155.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [split.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [marketplace.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [vote.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [multiwrap.address]),
      web3sdksFactory.interface.encodeFunctionData("addImplementation", [sigdrop.address]),
    ],
    options,
  );
  console.log("Adding implementations at tx: ", tx.hash);
  await tx.wait();

  const tx2 = await web3sdksRegistry.grantRole(await web3sdksRegistry.OPERATOR_ROLE(), web3sdksFactory.address);
  await tx2.wait();
  console.log("grant role: ", tx2.hash);

  console.log("DONE. Now verifying contracts...");

  await verify(web3sdksRegistry.address, [trustedForwarderAddress]);
  await verify(web3sdksFactory.address, [trustedForwarderAddress, web3sdksRegistry.address]);
  await verify(web3sdksFee.address, [trustedForwarderAddress, web3sdksFactory.address]);
  await verify(drop721.address, []);
  await verify(drop1155.address, []);
  await verify(drop20.address, []);
  await verify(tokenERC20.address, []);
  await verify(tokenERC721.address, []);
  await verify(tokenERC1155.address, []);
  await verify(split.address, []);
  await verify(marketplace.address, [nativeTokenWrapper[ethers.provider.network.chainId]]);
  await verify(vote.address, []);
  await verify(multiwrap.address, [nativeTokenWrapper[ethers.provider.network.chainId]]);
  await verify(sigdrop.address, []);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
