// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "contracts/interfaces/IWeb3sdksContract.sol";

// solhint-disable const-name-snakecase
contract MockWeb3sdksContract is IWeb3sdksContract {
    string public contractURI;
    bytes32 public constant contractType = bytes32("MOCK");
    uint8 public constant contractVersion = 1;

    function setContractURI(string calldata _uri) external {
        contractURI = _uri;
    }
}

contract MockWeb3sdksContractV2 is IWeb3sdksContract {
    string public contractURI;
    bytes32 public constant contractType = bytes32("MOCK");
    uint8 public constant contractVersion = 2;

    function setContractURI(string calldata _uri) external {
        contractURI = _uri;
    }
}
