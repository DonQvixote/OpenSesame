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

let reader;
window.App = {
  start: function() {
    EcommerceStore.setProvider(web3.currentProvider);
    
    if($("#index-page").length>0){
      renderStore()
    }
    
    if($('#list-item-page').length>0){
      $("#product-image").change( event => {
        if(event.target.files.length === 0) return
        const file = event.target.files[0]
        reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
      });      
      
      $("#add-item-to-store").submit(event => {
         event.preventDefault();
         const req = $("#add-item-to-store").serialize();
         let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
         let decodedParams = {}
         Object.keys(params)
          .forEach( k => decodedParams[k] = decodeURIComponent(decodeURI(params[k])) )
         saveProduct(reader, decodedParams);
      })      
    }
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

function saveImageOnIpfs(reader) {
  const buffer = Buffer.from(reader.result);
  return ipfs.add(buffer)
    .then( rsp => rsp[0].hash)
    .catch(err => console.error(err))
}

function saveTextBlobOnIpfs(blob) {
  const descBuffer = Buffer.from(blob, 'utf-8');
  return ipfs.add(descBuffer)
    .then( rsp => rsp[0].hash )
    .catch( err => console.error(err))
}

function saveProductToBlockchain(params, imageId, descId) {
  let auctionStartTime = Date.parse(params["product-auction-start"]) / 1000;
  let auctionEndTime = auctionStartTime + parseInt(params["product-auction-end"]) * 24 * 60 * 60
  return EcommerceStore.deployed()
    .then( inst => inst.addProductToStore(params["product-name"], 
                        params["product-category"], 
                        imageId, descId, auctionStartTime,auctionEndTime, 
                        web3.toWei(params["product-price"], 'ether'), 
                        parseInt(params["product-condition"]), 
                        {from: web3.eth.accounts[0], gas: 440000}))
    .then(() =>{
      $("#msg").show();
      $("#msg").html("Your product was successfully added to your store!");    
    })                          
    .catch(err => console.log(err))
}

function saveProduct(reader, decodedParams) {
  let imageId, descId;
  return saveImageOnIpfs(reader)
    .then(id => imageId = id) 
    .then(() => saveTextBlobOnIpfs(decodedParams["product-description"]) )
    .then(id => descId = id)  
    .then(() => saveProductToBlockchain(decodedParams, imageId, descId))
    .catch(err => console.log(err))
}