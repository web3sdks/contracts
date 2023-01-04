import hre, { ethers } from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ContractPublisher } from "typechain";

/**
 *
 * Deploys the contract publisher and verifies the contract.
 */

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
  // Define options
  const options = {
    //maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    //maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    //gasPrice: ethers.utils.parseUnits("100", "gwei"),
    gasLimit: 5_000_000,
  };

  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Forwarder contract needs to be deployed for the first time
  const trustedForwarder = await (await ethers.getContractFactory("ForwarderChainlessDomain")).deploy(options);
  // const trustedForwarder = await ethers.getContractAt("Forwarder", "0x91e373b8Caf9E0E0694099039Ce006aAc5598db2");
  console.log("Deploying Trusted Forwarder at tx: ", trustedForwarder.deployTransaction?.hash);
  await trustedForwarder.deployed();
  console.log("Trusted Forwarder address: ", trustedForwarder.address);

  // Define the contract address of the previous Publisher. It is zero address by default
  const prevPublisherAddress: string = ethers.constants.AddressZero;
  console.log("Previous Publisher address: ", prevPublisherAddress);

  const contractPublisher: ContractPublisher = await ethers
    .getContractFactory("ContractPublisher")
    .then(f => f.deploy(trustedForwarder.address, prevPublisherAddress, options));
  // const contractPublisher = await ethers.getContractAt("ContractPublisher", "0xF0db439D6EbE5D8A5C28a9492B4767BF32fC8505");
  console.log(
    "Deploying ContractPublisher at tx: ",
    contractPublisher.deployTransaction?.hash,
    " address: ",
    contractPublisher.address,
  );
  await contractPublisher.deployed();
  console.log("Deployed ContractPublisher");

  console.log("\nDone. Now verifying contracts:");

  await verify(trustedForwarder.address, []);
  await verify(contractPublisher.address, [trustedForwarder.address, prevPublisherAddress]);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
