//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Contract.sol";

contract ContractFactory {

  event ContractDeployed(
    address indexed creatorAddress,
    address indexed contractAddress
  );

    address[] private deployedContracts;

    mapping (address => address[]) deployedOwnerContracts;

    function createContract(string memory _ipfsHash) public {
        Contract newContract = new Contract(_ipfsHash, msg.sender);
        deployedContracts.push(address(newContract));
        deployedOwnerContracts[msg.sender].push(address(newContract));
        emit ContractDeployed(msg.sender, address(newContract));

    }

    //Do we need this? or every user should only see their own contracts?
    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }

    function getOwnerDeployedContracts() public view returns (address[] memory) {
        return deployedOwnerContracts[msg.sender];
    }
}
