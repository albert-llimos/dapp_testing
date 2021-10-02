import React, { Component } from 'react';
import Layout from '../../components/Layout'
import {Card} from 'semantic-ui-react'
import { Button, Form, Input, Message } from 'semantic-ui-react';

import web3 from '../../web3';

import Contract from '../../src/abis/Contract.json';


class ContractShow extends Component {

  state = {
      hash: '',
      errorMessage: ''
  };
  //Called before our component is rendered in the screen
  static async getInitialProps(props) {
    const abi = Contract.abi
    const address = props.query.address;
    const contractInstance = new web3.eth.Contract(abi, address)
    const manager = await contractInstance.methods.getManager().call();
    console.log(manager)
    return {manager,address};
  }

  renderCards() {
    const items = [
      {
        header: this.props.manager,
        meta: 'Address of Manager',
        description:
        'The manager created this contract and can access the hash',
        style: {overflowWrap: 'break-word'}
      }
    ];
    return <Card.Group items={items} />
  }

  onSubmit = async (event) => {
    //This prevents the browser from submiting the form to the backend server
    event.preventDefault();

    const abi = Contract.abi
    const address = this.props.address;
    const contractInstance = new web3.eth.Contract(abi, address)


    try {
      const accounts = await web3.eth.getAccounts()
      const hash = await contractInstance.methods.get().call({from:accounts[0]});
      this.setState ({hash:hash});
    } catch (err) {
      this.setState ({errorMessage: err.message});
    }
  };

  render() {
    return (
      <Layout>
        <h3> Contract Show </h3>
        <h1> {this.props.address}  </h1>

        {this.renderCards()}

        <Form onSubmit =  {this.onSubmit} error={!!this.state.errorMessage}>
          <Button primary> Get Hash </Button>
          <Message error header = "Oops!" content = {this.state.errorMessage} />
        </Form>

        <h3> Hash </h3>
        <h3> {this.state.hash}  </h3>

      </Layout>
    )
  }
}
export default ContractShow;
