#!/bin/bash
echo "Deploying new factory"
truffle migrate --reset --network rinkeby
echo "Setting up frontend"
cp -r ../build/contracts/* ../src/abis/
npm run dev
