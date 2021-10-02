//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Contract {

    string ipfsHash;

    address private manager;

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(string memory _ipfsHash, address _creator) {
        manager = _creator;
        ipfsHash = _ipfsHash;
    }

    function getManager() public view returns (address)  {
      return manager;
    }

    function get() public view onlyManager returns (string memory)  {
      return ipfsHash;
    }
}
