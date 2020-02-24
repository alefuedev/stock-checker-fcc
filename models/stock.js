let mongoose = require('mongoose');

let stockSchema = new mongoose.Schema({
  stock: {
    type: String,
  },
  price: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
	ips: [String]
});

let Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock
