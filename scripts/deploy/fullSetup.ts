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
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const GAS_LIMIT = 5_000_000; // When this value is too high, some chains will report a "ProviderError: HttpProviderError" error

var needPack = true;
var needGrantRole = true;
var needVerify = false;

var deployContracts = {
  "TrustedForwarder": {
    "className": "Forwarder",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // goerli
      "137": "", // polygon
      "80001": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // mumbai
      "250": "", // fantom
      "4002": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // fantom_testnet
      "43114": "", // avax
      "43113": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // optimism_goerli
      "56": "", // binance
      "97": "0xC82Cef7e15871A96E528356409A177cD00fc81F1", // binance_testnet
    },
    "needVerify": true,
    "verified": false,
  },
  "TWRegistry": {
    "className": "TWRegistry",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // goerli
      "137": "", // polygon
      "80001": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // mumbai
      "250": "", // fantom
      "4002": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // fantom_testnet
      "43114": "", // avax
      "43113": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // optimism_goerli
      "56": "", // binance
      "97": "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [deployContracts["TrustedForwarder"]["deployedAddresses"][chainId]];
    },
    "needVerify": true,
    "verified": false,
  },
  "TWFactory": {
    "className": "TWFactory",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // goerli
      "137": "", // polygon
      "80001": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // mumbai
      "250": "", // fantom
      "4002": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // fantom_testnet
      "43114": "", // avax
      "43113": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // optimism_goerli
      "56": "", // binance
      "97": "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [
        deployContracts["TrustedForwarder"]["deployedAddresses"][chainId],
        deployContracts["TWRegistry"]["deployedAddresses"][chainId],
      ];
    },
    "needVerify": true,
    "verified": false,
  },
  "TWFee": {
    "className": "TWFee",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // goerli
      "137": "", // polygon
      "80001": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // mumbai
      "250": "", // fantom
      "4002": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // fantom_testnet
      "43114": "", // avax
      "43113": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // optimism_goerli
      "56": "", // binance
      "97": "0x2b115B27cD07385BfeC7E1b9483C9520Ec625E65", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [
        deployContracts["TrustedForwarder"]["deployedAddresses"][chainId],
        deployContracts["TWFactory"]["deployedAddresses"][chainId],
      ];
    },
    "needPack": false,
    "needVerify": true,
    "packed": false,
    "verified": false,
  },
  "DropERC721": {
    "className": "DropERC721",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18", // goerli
      "137": "", // polygon
      "80001": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18", // mumbai
      "250": "", // fantom
      "4002": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18", // fantom_testnet
      "43114": "", // avax
      "43113": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18", // optimism_goerli
      "56": "", // binance
      "97": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18", // binance_testnet
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
      "5": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // goerli
      "137": "", // polygon
      "80001": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // mumbai
      "250": "", // fantom
      "4002": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // fantom_testnet
      "43114": "", // avax
      "43113": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // optimism_goerli
      "56": "", // binance
      "97": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65", // binance_testnet
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
      "5": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // goerli
      "137": "", // polygon
      "80001": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // mumbai
      "250": "", // fantom
      "4002": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // fantom_testnet
      "43114": "", // avax
      "43113": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // optimism_goerli
      "56": "", // binance
      "97": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2", // binance_testnet
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
      "5": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // goerli
      "137": "", // polygon
      "80001": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // mumbai
      "250": "", // fantom
      "4002": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // fantom_testnet
      "43114": "", // avax
      "43113": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // optimism_goerli
      "56": "", // binance
      "97": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4", // binance_testnet
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
      "5": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // goerli
      "137": "", // polygon
      "80001": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // mumbai
      "250": "", // fantom
      "4002": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // fantom_testnet
      "43114": "", // avax
      "43113": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // optimism_goerli
      "56": "", // binance
      "97": "0x70CE7258a420303238336491a8d96c4A6dDbE549", // binance_testnet
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
      "5": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // goerli
      "137": "", // polygon
      "80001": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // mumbai
      "250": "", // fantom
      "4002": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // fantom_testnet
      "43114": "", // avax
      "43113": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // optimism_goerli
      "56": "", // binance
      "97": "0x6D6EB73F013FF6996E1BbacC63697b7E0c0C15cF", // binance_testnet
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
      "5": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // goerli
      "137": "", // polygon
      "80001": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // mumbai
      "250": "", // fantom
      "4002": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // fantom_testnet
      "43114": "", // avax
      "43113": "0xf5D96665eaa9F3Fd7Bcac8DAf0ed5f4A23010d7D", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // optimism_goerli
      "56": "", // binance
      "97": "0xE4fA40390d2C99A77B2ae202d0fe2132B38D03D8", // binance_testnet
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
      "5": "0xf5D96665eaa9F3Fd7Bcac8DAf0ed5f4A23010d7D", // goerli
      "137": "", // polygon
      "80001": "0xf5D96665eaa9F3Fd7Bcac8DAf0ed5f4A23010d7D", // mumbai
      "250": "", // fantom
      "4002": "0x106a6080ef4889458D25f4404a88f20B5b30f560", // fantom_testnet
      "43114": "", // avax
      "43113": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xf5D96665eaa9F3Fd7Bcac8DAf0ed5f4A23010d7D", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xf5D96665eaa9F3Fd7Bcac8DAf0ed5f4A23010d7D", // optimism_goerli
      "56": "", // binance
      "97": "0xf5D96665eaa9F3Fd7Bcac8DAf0ed5f4A23010d7D", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [
        nativeTokenWrapper[chainId],
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
      "5": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // goerli
      "137": "", // polygon
      "80001": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // mumbai
      "250": "", // fantom
      "4002": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // fantom_testnet
      "43114": "", // avax
      "43113": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // optimism_goerli
      "56": "", // binance
      "97": "0x05A47fB0d4D77e570D6b084Bf1D868FBd84a6540", // binance_testnet
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
      "5": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // goerli
      "137": "", // polygon
      "80001": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // mumbai
      "250": "", // fantom
      "4002": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // fantom_testnet
      "43114": "", // avax
      "43113": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // optimism_goerli
      "56": "", // binance
      "97": "0x75D991f47D2129a8c45d074A30fE218ed3de98F3", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [
        nativeTokenWrapper[chainId],
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
      "5": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // goerli
      "137": "", // polygon
      "80001": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // mumbai
      "250": "", // fantom
      "4002": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // fantom_testnet
      "43114": "", // avax
      "43113": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // optimism_goerli
      "56": "", // binance
      "97": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // binance_testnet
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
      "5": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // goerli
      "137": "", // polygon
      "80001": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // mumbai
      "250": "", // fantom
      "4002": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // fantom_testnet
      "43114": "", // avax
      "43113": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // optimism_goerli
      "56": "", // binance
      "97": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd", // binance_testnet
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
      "5": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // goerli
      "137": "", // polygon
      "80001": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // mumbai
      "250": "", // fantom
      "4002": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // fantom_testnet
      "43114": "", // avax
      "43113": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // optimism_goerli
      "56": "", // binance
      "97": "0xF2CF34a9928a6aB04881bfEaAC5BedB6d05Abc27", // binance_testnet
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
      "5": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // goerli
      "137": "", // polygon
      "80001": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // mumbai
      "250": "", // fantom
      "4002": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // fantom_testnet
      "43114": "", // avax
      "43113": "0x5e1c754f28b7E8458Ec4E440F9187856bfeb048c", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // arbitrum_goerli
      "10": "", // optimism
      "420": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // optimism_goerli
      "56": "", // binance
      "97": "0xbc3D10e91D5fE510f6Fa8C8c4e285B9811BC928c", // binance_testnet
    },
    "needPack": true,
    "needVerify": true,
    "packed": false,
    "verified": false,
  },
  // Extra
  "ForwarderEOAOnly": {
    "className": "ForwarderEOAOnly",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x3B32f5132EE1BaC2CBbb431C9A68D0841985c41b", // goerli
      "137": "", // polygon
      "80001": "0x29ce93BAD941e89b4661121195275C1132e777FE", // mumbai
      "250": "", // fantom
      "4002": "0x29ce93BAD941e89b4661121195275C1132e777FE", // fantom_testnet
      "43114": "", // avax
      "43113": "0x170F1B2E15262860E65296A213Bff22f2378E189", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x29ce93BAD941e89b4661121195275C1132e777FE", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x29ce93BAD941e89b4661121195275C1132e777FE", // optimism_goerli
      "56": "", // binance
      "97": "0x29ce93BAD941e89b4661121195275C1132e777FE", // binance_testnet
    },
    "extra": true,
    "needVerify": true,
    "verified": false,
  },
  "BiconomyForwarder": {
    "className": "BiconomyForwarder",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x6b02587486FE607a13d6cE3A1b846736a095DA03", // goerli
      "137": "", // polygon
      "80001": "0x170F1B2E15262860E65296A213Bff22f2378E189", // mumbai
      "250": "", // fantom
      "4002": "0x170F1B2E15262860E65296A213Bff22f2378E189", // fantom_testnet
      "43114": "", // avax
      "43113": "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x170F1B2E15262860E65296A213Bff22f2378E189", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x170F1B2E15262860E65296A213Bff22f2378E189", // optimism_goerli
      "56": "", // binance
      "97": "0x170F1B2E15262860E65296A213Bff22f2378E189", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [caller?.address];
    },
    "extra": true,
    "needVerify": true,
    "verified": false,
  },
  "TWBYOCRegistry": {
    "className": "TWRegistry",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x2278f360795840FC75b3C2930b47d4e475fC0323", // goerli
      "137": "", // polygon
      "80001": "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF", // mumbai
      "250": "", // fantom
      "4002": "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF", // fantom_testnet
      "43114": "", // avax
      "43113": "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF", // optimism_goerli
      "56": "", // binance
      "97": "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [deployContracts["TrustedForwarder"]["deployedAddresses"][chainId]];
    },
    "extra": true,
    "needVerify": true,
    "verified": false,
  },
  "Pack": {
    "className": "Pack",
    "deployedAddresses": {
      "1": "", // mainnet
      "5": "0x4F7b003E67cad73D18E3FC4519D2E95623994d73", // goerli
      "137": "", // polygon
      "80001": "0x106a6080ef4889458D25f4404a88f20B5b30f560", // mumbai
      "250": "", // fantom
      "4002": "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE", // fantom_testnet
      "43114": "", // avax
      "43113": "0x106a6080ef4889458D25f4404a88f20B5b30f560", // avax_testnet
      "42161": "", // arbitrum
      "421613": "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE", // arbitrum_goerli
      "10": "", // optimism
      "420": "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE", // optimism_goerli
      "56": "", // binance
      "97": "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE", // binance_testnet
    },
    "params": function(chainId, caller) {
      return [
        nativeTokenWrapper[chainId],
        deployContracts["ForwarderEOAOnly"]["deployedAddresses"][chainId],
      ];
    },
    "extra": true,
    "needVerify": true,
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

async function deploy(chainId, caller, options, forExtra) {
  for (let name in deployContracts) {
    let isExtra = deployContracts[name] ? deployContracts[name].extra : false;
    if ((forExtra && !isExtra) || (!forExtra && isExtra)) {
      continue;
    }
    console.log(`\n>>>>>>>>>> Handle for "${name}"\n`);
    if (!chainId) {
      chainId = ethers.provider.network?.chainId;
      if (chainId) {
        console.log("Found current chainId: ", chainId);
      }
    }
    if (!chainId) {
      console.log(`[${name}] Unknow chainId, Ignore`);
      continue;
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
      deployContracts[name]["deployedAddresses"][chainId] = contract.address;
      console.log(`${name} has already been deployed, address: ${contract.address}`);
    } else {
      if (typeof(params) == 'function') {
        params = params(chainId, caller);
      }
      contract = params && params.length > 0
        ? await (await ethers.getContractFactory(className)).deploy(...params, options)
        : await (await ethers.getContractFactory(className)).deploy(options);
      console.log(`${name} is being deployed at tx: `, contract.deployTransaction?.hash);
      await contract.deployed();
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
}

async function main() {
  // Deploy FeeType
  const options = {
    //maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    //maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    //gasPrice: ethers.utils.parseUnits("100", "gwei"),
    gasLimit: GAS_LIMIT,
  };

  const [caller]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Invoker: ", caller?.address);

  // Get network infomation
  let chainId = ethers.provider.network?.chainId;
  if (!chainId) {
    chainId = ethers.provider?._hardhatProvider?._provider?._chainId;
  }
  console.log("ChainId: ", chainId);

  // Deploy contracts
  console.log(`\nReady to deploy main contracts`);
  await deploy(chainId, caller, options, false);

  // Pack
  console.log(`\nReady to pack..., need: ${needPack}, length: ${needToPacks.length}`);
  if (needPack && needToPacks.length > 0) {
    let web3sdkioFactory = deployContracts["TWFactory"]["contract"];
    if (web3sdkioFactory) {
      console.log("Pack factory address: ", web3sdkioFactory.address);
      console.log("Pack factory implementations: ", needToPacks);
      let multicallParams = [];
      for (let i in needToPacks) {
        multicallParams.push(web3sdkioFactory.interface.encodeFunctionData("addImplementation", [needToPacks[i]]));
      }
      console.log("Pack factory multicallParams: ", multicallParams);
      const tx = await web3sdkioFactory.multicall(multicallParams, options);
      console.log("Adding implementations at tx: ", tx.hash);
      await tx.wait();
      console.log("Added implementations at tx: ", tx.hash);
    } else {
      console.log("Pack fail: web3sdkioFactory is empty");
    }
  }

  // Grant role
  console.log(`\nReady to grant role..., need: ${needGrantRole}`);
  if (needGrantRole) {
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

  // Deploy extra contracts
  console.log(`\nReady to deploy extra contracts`);
  await deploy(chainId, caller, options, true);

  // Verify
  console.log(`\nReady to verify..., need: ${needVerify}, length: ${needToVerifies.length}`);
  if (needVerify) {
    for (let key in needToVerifies) {
      let name = needToVerifies[key];
      let contract = deployContracts[name]["contract"];
      let contractAddress = contract?.address;
      let params = deployContracts[name]["params"] || null;
      if (!contractAddress) {
        console.log(`The contract "${key}" address is empty, verify ignored`);
        continue;
      }
      if (params && typeof(params) == 'function') {
        params = params(chainId);
      } else if (!params) {
        params = [];
      }
      console.log(`Ready to verify contract: ${name}, params: `, params);
      await verify(contractAddress, params);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
