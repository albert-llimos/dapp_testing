DAPP made for learning purposes.

Contains a basic contract that stores a hash value and that can only be read by the owner. The hash vale can be read by other users since it is in the blockchain, so it is not private. This is only for learning purposes in the front end, the solidity code was not a relevant aspect here. There is a also a basic factory contract that deploys basic contracts and stores its location.


To install all the packages first:

npm install

To compile:
truffle compile
To deploy and test ( you need a local ganache-cli running, or run it on a testnet adding your mnemonic to the truffle-config.js file):

truffle migrate (--network rinkeby)
truffle test  (--network rinkeby)

I have made a simple frontend on top using React and NextJS where the user can deploy contracts through the factory and see a list of all the contracts deployed and who the manager is. If the user is the manager, it can also see the hash value stored by the contract, otherwise an error message appears.

A factory is already deployed on Rinkeby, so it is possible to just run the dAPP FrontEnd and interact with it. To do that, run:

npm run dev
(remember to set your metamask to Rinkeby).

I did not implement the redeployment of a factory, so if you want to do that I have created a small script to do it. Only "gotcha" is to remember to add your mnemonic to the truffle-config.js file. It seemed like a bad idea to leave my mnemonic there :)
This script will redeploy the factory on Rinkeby and start the frontend:

cd scripts
./frontend_reactnextjs.sh

(frontend is running on http://localhost:3000/)
(remember to set your metamask to Rinkeby).

This repo also contains some extremely simple react frontend I made for testing stuff, to try things like getting an ABI contract from etherescan. Both the code and frontend are ugly, it is just here because why remove it, right? No judgment on this one please :)
Same as before, to run it as is:

npm start

Or with a script, deploying a new factory on Rinkeby (mnemonic needed)

cd scripts
./frontend_react.sh

(frontend is running on http://localhost:3000/)
