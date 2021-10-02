const ContractFactory = artifacts.require("ContractFactory");
const Contract = artifacts.require("Contract");

const assert = require ('assert');

const utils = require("./helpers/utils");
//const time = require("./helpers/time");
var expect = require('chai').expect;

contract("ContractFactory", (accounts) => {
  let contractInstance;
  beforeEach(async () => {
      //This deploys a new contract every time
      contractInstance = await ContractFactory.new();
  });

	it('Deploys the Contract', () => {
		assert.ok(contractInstance.address);
	});

  it('Creates a Contract', async() => {
    const ipfsHash = "AEC058E"; //shortened Hash for testing
    const result = await contractInstance.createContract(ipfsHash);
    const eventEmitted = result.logs[0].args;
    assert.equal (eventEmitted.creatorAddress, accounts[0], 'Creator address is NOT correct');
    assert.ok(eventEmitted.contractAddress);
  });

  it('Checking number of deployed contracts', async() => {
    const ipfsHash = "AEC058E"; //shortened Hash for testing
    const numbContractsA = 5;
    for (var i = 1; i<= numbContractsA; i++){
      await contractInstance.createContract(ipfsHash);
    }
    let listContracts = await contractInstance.getOwnerDeployedContracts();
    assert.equal(listContracts.length,numbContractsA);

    const numbContractsB = numbContractsA + 1;
    for (var i = 1; i<= numbContractsB; i++){
      await contractInstance.createContract(ipfsHash,{from: accounts[1]});
    }
    listContracts = await contractInstance.getOwnerDeployedContracts();
    assert.equal(listContracts.length,numbContractsA);
    listContracts = await contractInstance.getOwnerDeployedContracts({from: accounts[1]});
    assert.equal(listContracts.length,numbContractsB);

    listContracts = await contractInstance.getOwnerDeployedContracts({from: accounts[2]});
    assert.equal(listContracts.length,0);

  });

  it('Check created Contract', async() => {
    const ipfsHash = "AEC058E"; //shortened Hash for testing
    const result = await contractInstance.createContract(ipfsHash, {from: accounts[1]});
    const eventEmitted = result.logs[0].args;
    //this uses the ABI from the JSON but with given address
    let deployedContract = await Contract.at(eventEmitted.contractAddress)
    assert.equal(eventEmitted.contractAddress, deployedContract.address)
    const contractManager = await deployedContract.getManager();
    assert.equal(contractManager,accounts[1]);

    await utils.shouldThrow(deployedContract.get());
    const ipfsHashContract = await deployedContract.get({from: accounts[1]});
    assert.equal(ipfsHashContract,ipfsHash);

  });

  it('Check different IPFS Hash', async() => {
    const realIpfsHashs = ["QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4 ",
                           "QmWdtEKTA6GoL2BJ9LYhBpqws1veMBLxhDf6hoY367ZQg2",
                           "QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE"];

    for (var i = 0; i < realIpfsHashs.length; i++){
      const result = await contractInstance.createContract(realIpfsHashs[i]);
      const eventEmitted = result.logs[0].args;
      let deployedContract = await Contract.at(eventEmitted.contractAddress)
      const ipfsHashContract = await deployedContract.get();
      assert.equal(ipfsHashContract,realIpfsHashs[i]);
    }
  });

})
