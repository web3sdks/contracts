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
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "DropERC721": {
    "className": "DropERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "DropERC1155": {
    "className": "DropERC1155",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "DropERC20": {
    "className": "DropERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "TokenERC20": {
    "className": "TokenERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "TokenERC721": {
    "className": "TokenERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "TokenERC1155": {
    "className": "TokenERC1155",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "Split": {
    "className": "Split",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "Marketplace": {
    "className": "Marketplace",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "VoteERC20": {
    "className": "VoteERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "Multiwrap": {
    "className": "Multiwrap",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "SignatureDrop": {
    "className": "SignatureDrop",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "AirdropERC20": {
    "className": "AirdropERC20",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "AirdropERC721": {
    "className": "AirdropERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
  },
  "AirdropERC1155": {
    "className": "AirdropERC1155",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "", // goerli
      "137": "", // polygon
      "80001": "", // mumbai
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
    "packed": false,
    "verified": false,
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
