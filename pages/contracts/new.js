import React, { Component } from 'react';
import Layout from '../../components/Layout';

import web3 from '../../web3';

import { Button, Form, Input, Message } from 'semantic-ui-react';

// or import it from build
import ContractFactory from '../../src/abis/ContractFactory.json';


//Trying to use NextJS but it doesn't work
//import { useRouter } from 'next/router';
import Link from 'next/link';

//Using Udemy "workaround"
import {Router} from '../../routes'
//import {Link} from '../../routes'
//The link component works both from next/link and from ../../routes



import { Menu, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";

class ContractNew extends Component {
  state = {
      contribution: '',
      errorMessage: '',
      loading: false
  };

  onSubmit = async (event) => {
    //This prevents the browser from submiting the form to the backend server
    event.preventDefault();

    this.setState ({loading:true, errorMessage: ''});

    const abi = ContractFactory.abi;
    const address = ContractFactory.networks[4].address;
    const factoryInstance = new web3.eth.Contract(abi, address);
    const hash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";
    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const result = await factoryInstance.methods.createContract(hash).send({from:accounts[0]});

      Router.pushRoute('/');
    } catch (err) {
      this.setState ({errorMessage: err.message});
    }

    this.setState({loading: false});

  };


  render() {
    return (
      <Layout>
        <h3> Create a new Contract! </h3>

        <Form onSubmit =  {this.onSubmit} error={!!this.state.errorMessage}>

          <Message error header = "Oops!" content = {this.state.errorMessage} />
          <Button loading ={this.state.loading} primary> Deploy! </Button>
        </Form>

        <Link href="/">
          <a>Home</a>
        </Link>

      </Layout>

       );
  }
}

export default ContractNew;
