import "bootstrap/dist/css/bootstrap.css"
import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import ecommerce_store_artifacts from '../../build/contracts/EcommerceStore.json'
import ipfsAPI from 'ipfs-api'
import ethUtil from 'ethereumjs-util'
import $ from 'jquery'

const ethereumNodeUrl = ETHEREUM_NODE_URL ? ETHEREUM_NODE_URL : 'http://localhost:8545'
const ipfsApiAddress = {
  protocol: 'http',
  host: IPFS_API_HOST ? IPFS_API_HOST : 'localhost',
  port: IPFS_API_PORT ? IPFS_API_PORT : 5001  
}
const ipfsGatewayUrl = IPFS_GATEWAY_URL ? IPFS_GATEWAY_URL : 'http://localhost:8080'

const EcommerceStore = contract(ecommerce_store_artifacts);
const ipfs = ipfsAPI(ipfsApiAddress);

window.App = {
  start: function() {
    EcommerceStore.setProvider(web3.currentProvider);
    renderStore()
  }
};

window.addEventListener('load', function() {
  window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
  App.start();
});

function renderStore() {
  let inst
  return EcommerceStore.deployed()
    .then(i => inst = i)
    .then(()=> inst.productIndex())
    .then(next => {
      for(let id=1;id<=next;id++){
        inst.getProduct.call(id)
          .then(p => $("#product-list").append(buildProduct(p)))
      }        
    })
}

function buildProduct(product) {
  let imgUrl = `${ipfsGatewayUrl}/ipfs/${product[3]}`
  let html = `<div>
                <img src="${imgUrl}" width="150px" />
                <div>${product[1]}</div>
                <div>${product[2]}</div>
                <div>${product[5]}</div>
                <div>${product[6]}</div>
                <div>Eether ${product[6]}</div>
              </div>`
  return $(html);
}