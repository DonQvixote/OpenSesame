const Web3 = require('web3')
const contract = require('truffle-contract')
const ecommerce_store_artifacts = require('../build/contracts/EcommerceStore.json')

const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const EcommerceStore = contract(ecommerce_store_artifacts);
EcommerceStore.setProvider(provider);

const Product = require('./product')

function setupProductEventListener() {
  EcommerceStore.deployed()
    .then(inst => {
      let productEvent = inst.NewProduct();
      productEvent.watch((err, ret) => {
        if (err) return console.log(err)
        Product.saveProduct(ret.args);
      })
    })
}

module.exports = setupProductEventListener;