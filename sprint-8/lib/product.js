const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  blockchainId: Number,
  name: String,
  category: String,
  ipfsImageHash: String,
  ipfsDescHash: String,
  auctionStartTime: Number,
  auctionEndTime: Number,
  price: Number,
  condition: Number,
  productStatus: Number
});

const ProductModel = mongoose.model('ProductModel', ProductSchema);

ProductModel.saveProduct = function saveProduct(product) {
  ProductModel.findOne({ 'blockchainId': product._productId.toLocaleString() }).exec()
    .then(dbProduct => {
      if (dbProduct != null)  return;
      
      let p = new ProductModel({
        name: product._name, 
        blockchainId: product._productId, 
        category: product._category,
        ipfsImageHash: product._imageLink, 
        ipfsDescHash: product._descLink, 
        auctionStartTime: product._auctionStartTime,
        auctionEndTime: product._auctionEndTime, 
        price: product._startPrice, 
        condition: product._productCondition,
        productStatus: 0
      });

      return p.save()
    })
    .then(()=>ProductModel.count().exec())
    .then(total => console.log('total',total))
    .catch(err => console.log(err))    
}

ProductModel.findProduct = function findProduct(query){
  let current_time = Math.round(Date.now() / 1000);
  let condition = {}
  condition['productStatus'] = {$eq: 0}

  if (Object.keys(query).length === 0) {
    condition['auctionEndTime'] = {$gt: current_time}
  } else if (query.category !== undefined) {
    condition['auctionEndTime'] = {$gt: current_time}
    condition['category'] = {$eq: query.category}
  } else if (query.productStatus == "reveal") {
    condition['auctionEndTime'] = {$lt: current_time, $gt: current_time - (60*60)}
  } else if (query.productStatus == "finalize") {
    condition['auctionEndTime'] = { $lt: current_time - (60*60) }
  }
  
  return ProductModel.find(condition, null, {sort: 'auctionEndTime'}).exec()
}

mongoose.connect("mongodb://localhost:27017/ebay_dapp");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = ProductModel;