let mongoose = require("mongoose");
let Stock = require("./../models/stock");

async function oneStock(response, ip, like, res) {
	let singleStock = await Stock.findOne(
		{ stock: response.symbol },
		function(err, doc) {
			if (err) {
				console.log(err);
			} else if (doc == null) {
				let s = new Stock();
				s.stock = response.symbol;
				s.price = response.latestPrice;
				if (
					s.ips.includes(ip) == false &&
					like == "true"
				) {
					s.likes = 1;
					s.ips.push(ip);
				}
				s.save();
				res.json({
					stockData: {
						stock: s.stock,
						price: s.price,
						likes: s.likes
					}
				});
			} else {
				//found
				if (
					doc.ips.includes(ip) == false &&
					like == "true"
				) {
					doc.ips.push(ip);
					doc.likes = doc.likes + 1;
					doc.save();
				}
				res.json({
					stockData: {
						stock: doc.stock,
						price: doc.price,
						likes: doc.likes
					}
				});
			}
		}
	);
}

async function twoStocks(firstResponse, secondResponse, likeStocks, ip, res) {
	let firstStock = await Stock.findOne(
		{ stock: firstResponse.symbol },
		function(err, doc) {
			if (err) {
				console.log(err);
			} else if (doc == undefined) {
				//not found create one
				let s = new Stock();
				s.stock = firstResponse.symbol;
				s.price = firstResponse.latestPrice;
				s.likes = 0;
				if (
					s.ips.includes(ip) == false &&
					likeStocks == true
				) {
					s.ips.push(ip);
					s.likes = 1;
				}
				s.save();
			} else {
				//found
				if (
					doc.ips.includes(ip) == false &&
					likeStocks == true
				) {
					doc.ips.push(ip);
					doc.likes = doc.likes + 1;
				}
				doc.save();
			}
		}
	);

	let secondStock = await Stock.findOne(
		{ stock: secondResponse.symbol },
		function(err, doc) {
			if (err) {
				console.log(err);
			} else if (doc == undefined) {
				// not found create one
				let s = new Stock();
				s.stock = secondResponse.symbol;
				s.price = secondResponse.latestPrice;
				s.likes = 0;
				if (
					s.ips.includes(ip) == false &&
					likeStocks == true
				) {
					s.ips.push(ip);
					s.likes = 1;
				}
				s.save();
			} else {
				// found
				if (
					doc.ips.includes(ip) == false &&
					likeStocks == true
				) {
					doc.ips.push(ip);
					doc.likes = doc.likes + 1;
				}
				doc.save();
			}
		}
	);
	let f = await Stock.findOne({ stock: firstResponse.symbol }, function(
		err,
		doc
	) {
		if (err) {
			console.log(err);
		} else {
			return doc;
		}
	});
	let s = await Stock.findOne({ stock: secondResponse.symbol }, function(
		err,
		doc
	) {
		if (err) {
			console.log(err);
		} else {
			return doc;
		}
	});

	res.json({
		stockData: [
			{
				stock: f.stock,
				price: f.price,
				res_likes: f.likes - s.likes
			},
			{
				stock: s.stock,
				price: s.price,
				res_likes: s.likes - f.likes
			}
		]
	});
}

module.exports = {
	oneStock,
	twoStocks
};
