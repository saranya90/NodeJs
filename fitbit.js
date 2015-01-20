// var fb = require('fitbit');
// fitbit = new fb({
// 	consumer_key: '0220d917aac34298b6943dbd78ec2381',
// 	consumer_secret: '5f0e3c5377694848a6fde6913d31ccb9',
// 	access_token_key: '',
// 	access_token_secret: ''
// });
// 
// var count = 0;
// 	util = require('util');
// 	
// fitbit.stream(

var express = require("express"),
	app = express();

var FitbitApiClient = require("fitbit-node"),
	client = new FitbitApiClient("0220d917aac34298b6943dbd78ec2381", "5f0e3c5377694848a6fde6913d31ccb9");

var requestTokenSecrets = {};

app.get("/authorize", function (req, res) {
	client.getRequestToken().then(function (results) {
		var token = results[0],
			secret = results[1];
		requestTokenSecrets[token] = secret;
		res.redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + token);
	}, function (error) {
		res.send(error);
	});
});
console.log("here");
app.get("http://localhost/?oauth_token=7996d54b6690c535b215066c1ffd8225&oauth_verifier=urc7u25cm250rho0olsf6qogjp", function (req, res) {
console.log("there");
	var token = req.query.oauth_token,
		secret = requestTokenSecrets[token],
		verifier = req.query.oauth_verifier;
		console.log(token);
	client.getAccessToken(token, secret, verifier).then(function (results) {
		var accessToken = results[0],
			accessTokenSecret = results[1],
			userId = results[2].encoded_user_id;
		return client.requestResource("/profile.json", "GET", accessToken, accessTokenSecret).then(function (results) {
			var response = results[0];
			res.send(response);
		});
	}, function (error) {
		res.send(error);
	});
});

app.listen(1024);