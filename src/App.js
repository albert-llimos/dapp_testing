import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import ContractFactory from './abis/ContractFactory.json'
import Contract from './abis/Contract.json'
import ipfs from './ipfs'

import $ from 'jquery';


//const web3 = window.web3

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

  }

  async loadWeb3() {
    //Instead of this should we just inject our web3??
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })


    //we get the network ID from the metamask network selected
    //compare that network to check if the contract has been deployed there
    const networkId = await web3.eth.net.getId()
    const networkData = ContractFactory.networks[networkId]
    if(networkData) {
      const abi = ContractFactory.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      this.setState({ contractAddress: contract.options.address })
    } else {
      // window.alert('Smart contract not deployed to detected network.')
    }

  }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      contractAddress: null,
	    buffer: null,
	    ipfsHash: '',
      message: '',
      contractDeployed: null,
      addressDeployed: '',
      ipfsHashContract: '',
      createdContractAddress: '',
      numberOfContractsDeployed: 0,
      numberOfContractsDeployedByMe : 0,

    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeploy = this.onDeploy.bind(this);
    this.onUploadContract = this.onUploadContract.bind(this);
    this.onUpdateNumberContracts = this.onUpdateNumberContracts.bind(this);
    this.onUpdateNumberContractsByMe = this.onUpdateNumberContractsByMe.bind(this);
    this.onGetContractABI = this.onGetContractABI.bind(this);

}

  captureFile(event) {
    event.preventDefault()
    //Not sure if this is the best way since when I convert it to arrayBuffer
    //I dont know how to get it back to original format
    const file = event.target.files[0]
    console.log(file)
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    console.log(reader);
    console.log(reader.result);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()

    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.setState({ ipfsHash: result[0].hash })
    })
  }

  async onDeploy (event, _ipfsHash) {

    event.preventDefault();

    const web3 = window.web3

    const networkId = await web3.eth.net.getId()
    const accounts = await web3.eth.getAccounts();
    console.log('Account[0]: ', accounts[0])
    console.log('Network ID: ', networkId)

    if (networkId === 4) {
      console.log ("Rinkeby Test Network")
    } else {
      console.error("ALERT: NOT RINKEBY TEST NETWORK")
      //other networks like mainnet shoul not do anything
      return
    }

    this.setState({message: 'Waiting on transaction success...'})


    const contractDeployed = await new web3.eth.Contract(Contract.abi).deploy({data: Contract.bytecode , arguments: [_ipfsHash,accounts[0]]}).send({from:accounts[0], gas: '1000000'})
    console.log ('Contract Deployed Address: ', contractDeployed.options.address)
    console.log (contractDeployed)

    this.setState({contractDeployed: contractDeployed})
    this.setState({addressDeployed: contractDeployed.options.address})

    this.setState({message: 'Transaction completed'})


  };

  async onUploadContract(event) {
    event.preventDefault()

    const web3 = window.web3

    const networkId = await web3.eth.net.getId()
    //This only returns one account, the current one
    const accounts = await web3.eth.getAccounts();

    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      console.log('ifpsHash', this.state.ipfsHashContract)
      this.setState({ ipfsHashContract: result[0].hash })
    })

    this.setState({message: 'Waiting on transaction success...'})

    const result2 = await this.state.contract.methods.createContract(this.state.ipfsHashContract).send({from:accounts[0], gas: '1000000'});
    const eventList = result2.events;
    const eventContractDeployed = result2.events.ContractDeployed;
    const contractCreator = result2.events.ContractDeployed.returnValues[0];
    const createdContractAddress = result2.events.ContractDeployed.returnValues[1];

    this.setState({ createdContractAddress: createdContractAddress })


    this.setState({message: 'Transaction completed'})

    const temp = await this.state.contract.methods.getDeployedContracts().call();
    console.log(temp);

    const createdContract = new web3.eth.Contract(Contract.abi, createdContractAddress)
    const temp2 = await createdContract.methods.getManager().call();
    console.log(temp2);


  }

  async onUpdateNumberContracts (event) {

    event.preventDefault();

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'})

    const listContracts = await this.state.contract.methods.getDeployedContracts().call();

    this.setState({ numberOfContractsDeployed: listContracts.length })

    this.setState({message: 'Transaction completed'})

  };

  async onUpdateNumberContractsByMe (event) {

    event.preventDefault();

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'})

    const listContracts = await this.state.contract.methods.getOwnerDeployedContracts().call({from:accounts[0]});

    this.setState({ numberOfContractsDeployedByMe: listContracts.length })

    this.setState({message: 'Transaction completed'})

  };

  async onGetContractABI (event) {

    event.preventDefault();

    //https://etherscan.io/apis#contracts
    const web3 = window.web3
    // Address verified contract from Ethereum MainNet (example) : 0x246F48bf00427D9abb3D44Caa709b1A90377ed90
    $.getJSON('https://api.etherscan.io/api?module=contract&action=getabi&address=0x246F48bf00427D9abb3D44Caa709b1A90377ed90', function (data) {
       console.log(data)
       console.log(data.result)
    });

  };

  render() {

  if (this.state.contract === null){
    return <h1> Contract Factory is not deployed </h1>
  }

    return (

      <div className="App">

      <h2> Contract generator & deployment Ethereum-IPFS</h2>

      <p> {"Contract Factory lives in address: " + this.state.contractAddress}</p>



        <h2>Deploy a contract directly (not through factory)</h2>
        <button onClick={(e) => { this.onDeploy(e, "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4"); }} >
          Deploy w/ hardcoded Hash
        </button>


        <h3> {this.state.message}</h3>
        <h3> {"Contract has been deployed to address: " + this.state.addressDeployed}</h3>

        <h2>Upload File to IPFS and store hash in a contract through the Factory</h2>
        <h4>wait for a bit for the transaction to be confirmed after submitting</h4>
        <form onSubmit={this.onUploadContract} >
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>

        <h4> {"Uploaded contract hash stored in contract's address: "  + this.state.createdContractAddress}</h4>
        <h4> {"Uploaded contract to IPFS: " + this.state.ipfsHashContract}</h4>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h3>Your Image on IPFS</h3>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHashContract}`} alt=""/>
            </div>
          </div>
        </main>


        <h2>{"Number of Contracts Deployed through the ContractFactory: " + this.state.numberOfContractsDeployed}</h2>
        <button onClick={(e) => { this.onUpdateNumberContracts(e)}} >
          Update
        </button>

        <h2>{"Number of Contracts Deployed BY ME through the ContractFactory: " + this.state.numberOfContractsDeployedByMe}</h2>
        <button onClick={(e) => { this.onUpdateNumberContractsByMe(e)}} >
          Update
        </button>

        <h2>{"Console Log ABI contract from a verified contract in Etherscan from Ethereum mainnet"}</h2>
        <h4>{"check browser console (F12)"}</h4>
        <button onClick={(e) => { this.onGetContractABI(e)}} >
          Update
        </button>
      </div>

    );
  }
}

export default App;
