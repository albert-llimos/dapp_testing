#!/bin/bash
echo "Deploying new factory"
truffle migrate --reset --network rinkeby
cp -r ../build/contracts/* ../src/abis/
echo "Setting up frontend"
npm run start
