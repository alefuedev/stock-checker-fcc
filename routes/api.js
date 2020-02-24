"use strict";
var expect = require("chai").expect;
let mongoose = require("mongoose");
let Stock = require("./../models/stock");
let fetch = require("node-fetch");
let functions = require("./../functions/checkfunctions");

mongoose.connect(process.env.DB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

module.exports = function(app) {
	app.route("/api/stock-prices").get(async function(req, res) {
		let stockName = req.query.stock;
		let ip = req.ip;
		let like = req.query.like;
		let url;
		let urlReq = req.url.split("stock");

		if (typeof stockName == "string") {
			stockName = stockName.toUpperCase();
			url = `https://cloud.iexapis.com/stable/stock/${stockName}/quote?token=${process.env.TOKEN_API}`;

			let response = await fetch(url)
				.then(response => {
					return response.json();
				})
				.catch(error => {
					res.json({ message: "error" });
				});

			if (response != undefined) {
				functions.oneStock(response, ip, like, res);
			}
		} else {
			let firstStock = stockName[0].toUpperCase();
			let secondStock = stockName[1].toUpperCase();
			let like = urlReq.length - 1;
			let likeStocks = urlReq[like].includes("like=true");

			url = `https://cloud.iexapis.com/stable/stock/${firstStock}/quote?token=${process.env.TOKEN_API}`;
			let secondUrl = `https://cloud.iexapis.com/stable/stock/${secondStock}/quote?token=${process.env.TOKEN_API}`;

			let firstResponse = await fetch(url)
				.then(response => {
					return response.json();
				})
				.catch(error => {
					res.json({ message: "error" });
				});

			let secondResponse = await fetch(secondUrl)
				.then(response => {
					return response.json();
				})
				.catch(error => {
					res.json({ message: "error" });
				});

			if (
				firstResponse != undefined &&
				secondResponse != undefined
			) {
				functions.twoStocks(
					firstResponse,
					secondResponse,
					likeStocks,
					ip,
					res
				);
			}
		}
	});
};
