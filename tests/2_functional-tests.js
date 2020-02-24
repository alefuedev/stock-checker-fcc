/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
	suite("GET /api/stock-prices => stockData object", function() {
		test("1 stock", function(done) {
			chai.request(server)
				.get("/api/stock-prices")
				.query({ stock: "goog" })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(
						res.body.stockData.stock,
						"GOOG"
					);
					chai.expect(
						res.body.stockData.price
					).to.be.a("string");
					chai.expect(
						res.body.stockData.likes
					).to.be.a("number");
					done();
				});
		});

		test("1 stock with like", function(done) {
			chai.request(server)
				.get("/api/stock-prices")
				.query({ stock: "aio", like: "true" })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(
						res.body.stockData.stock,
						"AIO"
					);
					assert.equal(
						res.body.stockData.likes,
						1
					);
					done();
				});
		});

		test("1 stock with like again (ensure likes arent double counted)", function(done) {
			chai.request(server)
				.get("/api/stock-prices")
				.query({ stock: "aio", like: "true" })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(
						res.body.stockData.stock,
						"AIO"
					);
					assert.equal(
						res.body.stockData.likes,
						1
					);
					done();
				});
		});

		test("2 stocks", function(done) {
			chai.request(server)
				.get("/api/stock-prices")
				.query({ stock: ["aapl", "goog"] })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					let textResponse = res.text;
					assert.equal(
						textResponse.includes("AAPL"),
						true
					);
					assert.equal(
						textResponse.includes("GOOG"),
						true
					);
					done();
				});
		});

		test("2 stocks with like", function(done) {
			chai.request(server)
				.get("/api/stock-prices")
				.query({
					stock: ["aapl", "goog"],
					like: ["true", "true"]
				})
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(
						res.body.stockData[0].stock,
						"AAPL"
					);
					chai.expect(
						res.body.stockData[0].price
					).to.be.a("string");
					chai.expect(
						res.body.stockData[0].res_likes
					).to.be.a("number");
					assert.equal(
						res.body.stockData[1].stock,
						"GOOG"
					);
					chai.expect(
						res.body.stockData[1].price
					).to.be.a("string");
					chai.expect(
						res.body.stockData[1].res_likes
					).to.be.a("number");
					done();
				});
		});
	});
});
