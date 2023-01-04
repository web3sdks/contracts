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
  // const forwarderEOAOnly = await ethers.getContractAt("ForwarderEOAOnly", "0xBF2cd070B6Ce0e7cEcf4619be89B2093afB2B13b");
  console.log("Deploying ForwarderEOAOnly at tx: ", forwarderEOAOnly.deployTransaction?.hash);
  await forwarderEOAOnly.deployed();
  console.log("ForwarderEOAOnly address: ", forwarderEOAOnly.address);

  // Deploy BiconomyForwarder
  const biconomyForwarder = await (
    await ethers.getContractFactory("BiconomyForwarder")
  ).deploy(deployer.address, options);
  // const biconomyForwarder = await ethers.getContractAt("BiconomyForwarder", "0x880B4e2b2eD6c68EA30125989F1560264cE737Df");
  console.log("Deploying BiconomyForwarder at tx: ", biconomyForwarder.deployTransaction?.hash);
  await biconomyForwarder.deployed();
  console.log("BiconomyForwarder address: ", biconomyForwarder.address);

  // Get Forwarder
  const trustedForwarderAddress: string = "0x5D1021751de591fEd8562eE92731F6D612D4cC81"; // replace
  const trustedForwarder: Forwarder = await ethers.getContractAt("Forwarder", trustedForwarderAddress);
  await trustedForwarder.deployed();
  console.log("Trusted Forwarder address: ", trustedForwarder.address);

  // Deploy TWBYOCRegistry
  const twBYOCRegistry = await (
    await ethers.getContractFactory("TWRegistry")
  ).deploy(trustedForwarderAddress, options);
  // const twBYOCRegistry = await ethers.getContractAt("TWRegistry", "0x1A083bCB5Fe719275329C80d7D033DCaCC21461a");
  console.log("Deploying TWBYOCRegistry at tx: ", twBYOCRegistry.deployTransaction?.hash);
  await twBYOCRegistry.deployed();
  console.log("TWBYOCRegistry address: ", twBYOCRegistry.address);

  // Deploy Pack
  const chainId: number = hre.network.config.chainId as number;
  const nativeTokenWrapperAddress: string = nativeTokenWrapper[chainId];
  const pack = await (
    await ethers.getContractFactory("Pack")
  ).deploy(nativeTokenWrapperAddress, forwarderEOAOnly.address, options);
  // const pack = await ethers.getContractAt("Pack", "0x324CAd44c0d07f96B9de4aef5Dd0086Af61be42F");
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
