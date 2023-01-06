import hre, { ethers } from "hardhat";

import {
  Forwarder,
  ForwarderEOAOnly,
  BiconomyForwarder,
  TWRegistry,
  Pack,
} from "typechain";
import { nativeTokenWrapper } from "../../utils/nativeTokenWrapper";

async function verify(address: string, args: any[], contract: string) {
  try {
    let options = {
      address: address,
      constructorArguments: args,
    };
    if (contract) {
      options["contract"] = contract;
    }
    return await hre.run("verify:verify", options);
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

  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Deploy ForwarderEOAOnly
  const forwarderEOAOnly = await (
    await ethers.getContractFactory("ForwarderEOAOnly")
  ).deploy(options);
  // const forwarderEOAOnly = await ethers.getContractAt("ForwarderEOAOnly", "0x29ce93BAD941e89b4661121195275C1132e777FE");
  console.log("Deploying ForwarderEOAOnly at tx: ", forwarderEOAOnly.deployTransaction?.hash);
  await forwarderEOAOnly.deployed();
  console.log("ForwarderEOAOnly address: ", forwarderEOAOnly.address);

  // Deploy BiconomyForwarder
  const biconomyForwarder = await (
    await ethers.getContractFactory("BiconomyForwarder")
  ).deploy(deployer.address, options);
  // const biconomyForwarder = await ethers.getContractAt("BiconomyForwarder", "0x170F1B2E15262860E65296A213Bff22f2378E189");
  console.log("Deploying BiconomyForwarder at tx: ", biconomyForwarder.deployTransaction?.hash);
  await biconomyForwarder.deployed();
  console.log("BiconomyForwarder address: ", biconomyForwarder.address);

  // Get Forwarder (Forwarder.sol)
  const trustedForwarderAddress: string = "0xC82Cef7e15871A96E528356409A177cD00fc81F1"; // replace
  const trustedForwarder: Forwarder = await ethers.getContractAt("Forwarder", trustedForwarderAddress);
  await trustedForwarder.deployed();
  console.log("Trusted Forwarder address: ", trustedForwarder.address);

  // Deploy TWBYOCRegistry
  const twBYOCRegistry = await (
    await ethers.getContractFactory("TWRegistry")
  ).deploy(trustedForwarderAddress, options);
  // const twBYOCRegistry = await ethers.getContractAt("TWRegistry", "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF");
  console.log("Deploying TWBYOCRegistry at tx: ", twBYOCRegistry.deployTransaction?.hash);
  await twBYOCRegistry.deployed();
  console.log("TWBYOCRegistry address: ", twBYOCRegistry.address);

  // Deploy Pack
  const chainId: number = hre.network.config.chainId as number;
  const nativeTokenWrapperAddress: string = nativeTokenWrapper[chainId];
  const pack = await (
    await ethers.getContractFactory("Pack")
  ).deploy(nativeTokenWrapperAddress, forwarderEOAOnly.address, options);
  // const pack = await ethers.getContractAt("Pack", "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE");
  console.log("Deploying Pack at tx: ", pack.deployTransaction?.hash);
  await pack.deployed();
  console.log("Pack address: ", pack.address);

  // Verify contracts
  console.log("DONE. Now verifying contracts...");
  await verify(forwarderEOAOnly.address, [], "contracts/forwarder/ForwarderEOAOnly.sol:ForwarderEOAOnly");
  await verify(biconomyForwarder.address, [deployer.address]);
  await verify(twBYOCRegistry.address, [trustedForwarderAddress]);
  await verify(pack.address, [nativeTokenWrapperAddress, forwarderEOAOnly.address]);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
