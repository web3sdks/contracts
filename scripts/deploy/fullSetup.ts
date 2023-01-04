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
  AirdropERC20,
  AirdropERC721,
  AirdropERC1155,
} from "typechain";
import { nativeTokenWrapper } from "../../utils/nativeTokenWrapper";

const GAS_LIMIT = 5_000_000;

var neetGrantRole = false;

var deployContracts = {
  "TrustedForwarder": {
    "className": "Forwarder",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x5D1021751de591fEd8562eE92731F6D612D4cC81", // goerli
      "137": "", // polygon
      "80001": "0x83b69703543B7240b2e8218f9Ca21255e007AD49", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
  },
  "TWRegistry": {
    "className": "TWRegistry",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xB161f6EA00A3008F20a32d465E5364B0905A33Ad", // goerli
      "137": "", // polygon
      "80001": "0x535Dc6e14C23623145e396271cc45858CCE0F21c", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "params": function(chainId) {
      return [deployContracts["TrustedForwarder"]["deployedAddresses"][chainId]];
    },
  },
  "TWFactory": {
    "className": "TWFactory",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x80a1d6255191D2Af220a35640F393de5B6266f02", // goerli
      "137": "", // polygon
      "80001": "0xA3033c3d137b58edC315362c5B1858613b88c61C", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "params": function(chainId) {
      return [
        deployContracts["TrustedForwarder"]["deployedAddresses"][chainId],
        deployContracts["TWRegistry"]["deployedAddresses"][chainId],
      ];
    },
  },
  "TWFee": {
    "className": "TWFee",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x2d484d217F3CF9C0AF4E4bE27825B946B0F1049F", // goerli
      "137": "", // polygon
      "80001": "0xc18DE50c8513FE9F5d0e30FE25CC9082229C95F0", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "params": function(chainId) {
      return [
        deployContracts["TrustedForwarder"]["deployedAddresses"][chainId],
        deployContracts["TWFactory"]["deployedAddresses"][chainId],
      ];
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "DropERC721": {
    "className": "DropERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x20e099109dbEbBD11058EeB39417B2eCA52C83f0", // goerli
      "137": "", // polygon
      "80001": "0xc2945698dc0b20bE08d0344F27F41eA26655134b", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "DropERC1155": {
    "className": "DropERC1155",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xEE89E8E54271F30738883e28DD7f8226805a6848", // goerli
      "137": "", // polygon
      "80001": "0x1274317550F24C45d1F035Ee53D89df02B0AeA84", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "DropERC20": {
    "className": "DropERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x5Abe68be6ecE6586Bd438BE25cEed2D5707F2a95", // goerli
      "137": "", // polygon
      "80001": "0x2ea37Ba764e631F9C0883F1994D221a5398FC7b3", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "TokenERC20": {
    "className": "TokenERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x07Fd3DAdf1f81BfA0ab0841c33e44789E78335F0", // goerli
      "137": "", // polygon
      "80001": "0x212232D6500E9b3CFD9CaEED512bF179622F8Ca6", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "TokenERC721": {
    "className": "TokenERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x2F7f4Ac01119F8F99B94F0927EfA27D7818A074b", // goerli
      "137": "", // polygon
      "80001": "0x5D1021751de591fEd8562eE92731F6D612D4cC81", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "TokenERC1155": {
    "className": "TokenERC1155",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x436bC195D4BFFD9aA0DfB20688737cF7D7Ab3e35", // goerli
      "137": "", // polygon
      "80001": "0xB161f6EA00A3008F20a32d465E5364B0905A33Ad", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "Split": {
    "className": "Split",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xC5a73A3794423CB30029ab5c6d0acb22f6CcCDA2", // goerli
      "137": "", // polygon
      "80001": "0x80a1d6255191D2Af220a35640F393de5B6266f02", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "Marketplace": {
    "className": "Marketplace",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x28F97d65F66F5D4f152e9A46Cf3D6DF22307e86d", // goerli
      "137": "", // polygon
      "80001": "0x2d484d217F3CF9C0AF4E4bE27825B946B0F1049F", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "params": function(chainId) {
      return [
        nativeTokenWrapper[ethers.provider.network.chainId],
      ];
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "VoteERC20": {
    "className": "VoteERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x73ab01d8Eeb0Ac0C012BC1ca20d5A0494C38a376", // goerli
      "137": "", // polygon
      "80001": "0xfCbC4b66C6fa60cDB1636dCDCE02c6137d5Ebb31", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "Multiwrap": {
    "className": "Multiwrap",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x831e2B04c4aF9a3759C5D8FeA49692e8a0294B01", // goerli
      "137": "", // polygon
      "80001": "0xf9a496Ac51b578DBE2228475D5b49636881C3B53", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "params": function(chainId) {
      return [
        nativeTokenWrapper[ethers.provider.network.chainId],
      ];
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "SignatureDrop": {
    "className": "SignatureDrop",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xFDb9cc34BfA6a51e96F73f0a828717A6dfA460E8", // goerli
      "137": "", // polygon
      "80001": "0xa6E25788347CD71A319Fcac6Dd74cC476843cBe8", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "AirdropERC20": {
    "className": "AirdropERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xFDb9cc34BfA6a51e96F73f0a828717A6dfA460E8", // goerli
      "137": "", // polygon
      "80001": "0x73ab01d8Eeb0Ac0C012BC1ca20d5A0494C38a376", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "AirdropERC721": {
    "className": "AirdropERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xFDb9cc34BfA6a51e96F73f0a828717A6dfA460E8", // goerli
      "137": "", // polygon
      "80001": "0x831e2B04c4aF9a3759C5D8FeA49692e8a0294B01", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
  "AirdropERC1155": {
    "className": "AirdropERC1155",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xFDb9cc34BfA6a51e96F73f0a828717A6dfA460E8", // goerli
      "137": "", // polygon
      "80001": "0xFDb9cc34BfA6a51e96F73f0a828717A6dfA460E8", // mumbai
      "250": "", // fantom
      "4002": "", // fantom_testnet
      "43114": "", // avax
      "43113": "", // avax_testnet
      "42161": "", // arbitrum
      "421613": "", // arbitrum_goerli
      "10": "", // optimism
      "420": "", // optimism_goerli
      "56": "", // binance
      "97": "", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": true,
    "verified": true,
  },
};
var needToPacks = [];
var needToVerifies = [];

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
    gasLimit: GAS_LIMIT,
  };

  const trustedForwarder = await ethers.getContractAt("Forwarder", "0x83b69703543B7240b2e8218f9Ca21255e007AD49");
  await trustedForwarder.deployed();

  // Get network infomation
  let chainId = ethers.provider.network?.chainId;

  // Deploy contracts
  for (let name in deployContracts) {
    if (!chainId) {
      chainId = ethers.provider.network?.chainId;
      if (chainId) {
        console.log("Found current chainId: ", chainId);
      }
    }
    let deployContract = deployContracts[name];
    let className = deployContract?.className;
    let deployedAddresses = deployContract?.deployedAddresses;
    let deployedAddress = deployedAddresses ? deployedAddresses[chainId] : null;
    let params = deployContract?.params;
    if (!className) {
      console.log(`The contract className of "${name}" is empty, ignored.`);
      continue;
    }
    let contract;
    if (deployedAddress) {
      contract = await ethers.getContractAt(className, deployedAddress);
      console.log(`${name} has already been deployed, address: ${deployedAddress}`);
    } else {
      if (typeof(params) == 'function') {
        params = params(chainId);
      }
      contract = params && params.length > 0
        ? await (await ethers.getContractFactory(className)).deploy(options, ...params)
        : await (await ethers.getContractFactory(className)).deploy(options);
      deployContracts[name]["deployedAddresses"][chainId] = contract.address;
      console.log(`${name} successfully deployed, address: ${contract.address}`);
    }
    if (contract) {
      if (deployContracts[name].needPack && !deployContracts[name].packed) {
        needToPacks.push(contract.address);
      }
      if (deployContracts[name].needVerify && !deployContracts[name].verified) {
        needToVerifies.push(name);
      }
    }
    deployContracts[name]["contract"] = contract;
  }

  // TODO Pack
  console.log(`Ready to pack..., length: ${needToPacks.length}`);
  if (needToPacks.length > 0) {
    let web3sdkioFactory = deployContracts["TWFactory"]["contract"];
    if (web3sdkioFactory) {
      console.log("Pack factory address: ", web3sdkioFactory.address);
      console.log("Pack factory implementations: ", needToPacks);
      let multicallParams = [];
      for (let i in needToPacks) {
        multicallParams.push(web3sdkioFactory.interface.encodeFunctionData("addImplementation", [needToPacks[i]]));
      }
      const tx = await web3sdkioFactory.multicall(multicallParams, options);
      console.log("Adding implementations at tx: ", tx.hash);
      await tx.wait();
      console.log("Added implementations at tx: ", tx.hash);
    } else {
      console.log("Pack fail: web3sdkioFactory is empty");
    }
  }
  
  // Grant role
  console.log(`Ready to grant role..., need: ${neetGrantRole}`);
  if (neetGrantRole) {
    let web3sdkioRegistry = deployContracts["TWRegistry"]["contract"];
    let web3sdkioFactory = deployContracts["TWFactory"]["contract"];
    if (web3sdkioRegistry && web3sdkioFactory) {
      const grantRoleTx = await web3sdkioRegistry.grantRole(await web3sdkioRegistry.OPERATOR_ROLE(), web3sdkioFactory.address);
      console.log("Granting role at tx: ", grantRoleTx.hash);
      await grantRoleTx.wait();
      console.log("Granted role at tx: ", grantRoleTx.hash);
    } else {
      let errorText = "";
      if (!web3sdkioRegistry) {
        errorText = "web3sdkioRegistry is empty";
      }
      if (!web3sdkioFactory) {
        errorText = (errorText ? " and " : "") + "web3sdkioFactory is empty";
      }
      console.log(`Granted role fail: ${errorText}`);
    }
  }

  // Verify
  console.log(`Ready to verify..., length: ${needToVerifies.length}`);
  for (let key in needToVerifies) {
    let name = needToVerifies[key];
    let contract = deployContracts[name]["contract"];
    let contractAddress = contract?.address;
    if (!contractAddress) {
      console.log(`The contract "${key}" address is empty, verify ignored`);
      continue;
    }
    await verify(contractAddress, deployContracts[name]["params"] || []);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
