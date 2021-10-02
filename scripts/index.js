//Run by running node index.js

let request = require('request')


let options = {
  /// Call the INFURA API and check that the address is valid.
  // url: 'https://filecoin.infura.io',
  /// Call the Lotus API and check that the address is valid.
  url: 'http://localhost:7777/rpc/v0',
  method: 'post',
  headers: {
    'content-type': 'application/json'
  },
  // Auth required when connecting to Infura, not required for local Ganache
//  auth: {
//    user: '1u25GuDFuCvFw2myf5Rj9T41M2j',
//    pass: 'a87d0507d503c9f24435ceab95dbead6'
//  },

  /*
  // params === wallet created by Ganache
  body: `{
      "jsonrpc": "2.0",
      "id": 0,
      "method": "Filecoin.WalletBalance",
      "params": ["t3wq63ytj622e2z4bs7ql7y2vq7nqmwgo44b5h734wyu6qzfju342sohqvddmch7x3ppw4y6mltvfrz3mnmzia"]
  }`
 */
 /*
    body: `{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "Filecoin.ChainHead",
      "params": [""]
  }`
  */
  
    body: `{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "Filecoin.ClientGetDealInfo",
    "params": [ {  "/":  "bafyreigfgto3kqagj3xgr2zwaj5i3n3btco5rishl3qu2a54t7x7rgtwhq" } ]
	}`
	
}

request(options, (error, response, body) => {
  if (error) {
    console.error('Error: ', error)
  } else {
    console.log('Response: ', body)
  }
})
