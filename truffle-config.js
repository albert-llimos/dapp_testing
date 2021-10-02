const HDWalletProvider = require("truffle-hdwallet-provider");
//const LoomTruffleProvider = require('loom-truffle-provider'); //comented out for now because I cant install loom

const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')

const mnemonic = 'Add your own mnemonic here';

module.exports = {

    networks: {

        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
//            gas: 9500000
        },

        mainnet: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/<YOUR_INFURA_API_KEY>")
            },
            network_id: "1"
        },

        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/327486c4905348609d2424aec513b322')
            },
            network_id: 4
        },

        loom_testnet: {
            provider: function() {
                const privateKey = 'YOUR_PRIVATE_KEY';
                const chainId = 'extdev-plasma-us1';
                const writeUrl = 'wss://extdev-basechain-us1.dappchains.com/websocket';
                const readUrl = 'wss://extdev-basechain-us1.dappchains.com/queryws';
                const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
                loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
                return loomTruffleProvider;
            },
            network_id: '9545242630824'
        },

	    basechain: {
			provider: function() {
				const chainId = 'default';
				const writeUrl = 'http://basechain.dappchains.com/rpc';
				const readUrl = 'http://basechain.dappchains.com/query';
				return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
				const privateKeyPath = path.join(__dirname, 'mainnet_private_key');
				const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl);
				return loomTruffleProvider;
			},
			network_id: '*'
		}
    },

    environments: {
      development: {
        ipfs: {
          address: "http://127.0.0.1:5001", // defaults to local IPFS node
        },
        filecoin: {
          address: "http://localhost:7777/rpc/v0", // defaults to ganache / local Filecoin node
          // token: "FILECOIN_NODE_AUTH_TOKEN",
          storageDealOptions: {
            epochPrice: "2500",
            duration: 518400,
          }
        },
        buckets: {
          key: "MY_BUCKETS_KEY",
          secret: "MY_BUCKETS_SECRET",
          bucketName: "MY_BUCKET_NAME",
        }
      },
      production: {
        ipfs: {
          address: "https://ipfs.infura.io:5001"
        },

        filecoin: {
          //none of this trial works
          address: 'https://filecoin.infura.io/v3/1u25GuDFuCvFw2myf5Rj9T41M2j:a87d0507d503c9f24435ceab95dbead6',

          /*
          user: '1u25GuDFuCvFw2myf5Rj9T41M2j:a87d0507d503c9f24435ceab95dbead6',
          url: "https://ipfs.infura.io:5001"
          */
          /*
          url: "https://filecoin.infura.io/v3/1u25GuDFuCvFw2myf5Rj9T41M2j:a87d0507d503c9f24435ceab95dbead6",
          auth: {
            user: '1u25GuDFuCvFw2myf5Rj9T41M2j',
            pass: 'a87d0507d503c9f24435ceab95dbead6'
          },
          */
        },
      },
    },
    compilers: {
        solc: {
            version: "0.8.0"
        }
    }
};
