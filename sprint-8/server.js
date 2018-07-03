const express = require('express');
const app = express();
const Product = require('./lib/product')
const setupProductEventListener = require('./lib/event-listener')

setupProductEventListener()

app.use(express.static(__dirname + '/build'))

app.get('/api/product', (req,rsp) => {
  Product.findProduct(req.query)
    .then(ret => rsp.send(ret))
    .catch(err => rsp.status(500).send('internal error'))
})

app.listen(8080, function() {
 console.log('Ebay dapp server listening on port 8080!');
});