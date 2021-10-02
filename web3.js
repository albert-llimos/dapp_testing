// *Udemy* way to do it (even though they put it in a web3.js script)
// We want to inject a certain version of Web3
// To not take the one from Metamask, since we don't know the version

//called from pages/index.js from NextJS
// could also be called by App.js from React, but doing it differently there
import Web3 from 'web3';

let web3;


if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
  console.log("Using Metamask")
} else {
  // We are on the server *OR* the user is not running metamask
  //Create our own instance of web3
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/327486c4905348609d2424aec513b322'
  );
  web3 = new Web3(provider);
  console.log("Using Infura")

}



export default web3;
