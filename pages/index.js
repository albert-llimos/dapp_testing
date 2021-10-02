import React, { Component } from 'react';

//  Running the web3.js instead of doing it the old way, inside
// the loadWeb3 function
import web3 from '../web3';

//Any of these two should work
//import factory from '../build/contracts/ContractFactory'
import ContractFactory from '../src/abis/ContractFactory';

import { Card, Button } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

import Layout from '../components/Layout'

import Link from 'next/link';

import {Router} from '../routes';
import { Form } from 'semantic-ui-react';


class ContractIndex extends Component{


  //Called before our component is rendered in the screen
  static async getInitialProps() {
    const abi = ContractFactory.abi
    const address = ContractFactory.networks[4].address
    const factoryInstance = new web3.eth.Contract(abi, address)
    const contracts = await factoryInstance.methods.getDeployedContracts().call();
    return  {contracts, address}
  }


  renderContracts() {
    console.log(this.props.contracts[0]);

    const items = this.props.contracts.map( address => {
        return {
          header: address,
          description: (
            <Link href = {`/contracts/${address}`}>
              <a> View Contract </a>
            </Link>
          ),
          fluid: true
        };
    });
    return <Card.Group items = {items} />;
  }

  onSubmit = async (event) => {

    event.preventDefault();

    Router.replaceRoute('');



  };


  render () {

    return (

    <Layout>

      <div>

        <h3> Signed Contracts in Factory {this.props.address} </h3>

        <Link href="">
          <a>
            <Button floated ="right" content='Create Factory (not implemented)' icon='add circle' primary />
          </a>
        </Link>

        <Link href="/contracts/new">
          <a>
            <Button content='Create Contract' icon='add circle' primary />
          </a>
        </Link>

        {this.renderContracts()}
        <h3>
        <Form onSubmit =  {this.onSubmit} >
          <Button primary> Refresh </Button>
        </Form>
        </h3>
      </div>

    </Layout>
    );
  }
}
export default ContractIndex;
