EcommerceStore = artifacts.require("./EcommerceStore.sol");

module.exports = function(callback){
  amt_1 = web3.toWei(1, 'ether');
  current_time = Math.round(new Date() / 1000);
  
  EcommerceStore.deployed()
    .then(inst => {
      inst.addProductToStore('iphone 6', 'Cell Phones & Accessories', 'imagelink', 
                      'desclink', current_time, current_time + 200, amt_1, 0)
        .then(()=> inst.productIndex())
        .then(lastid => inst.getProduct(lastid))
        .then(product => console.log(product))
    });  
}