var express = require('express')
  , app = express()
  , Fitbit = require('fitbit');

  var RateLimiter = require('limiter').RateLimiter;


app.use(express.cookieParser());
app.use(express.session({secret: 'hekdhthigib'}));
app.listen(3000);
var tokenS, tokenSS, verifierS;
// OAuth flow
app.get('/', function (req, res) {
  // Create an API client and start authentication via OAuth
  var client = new Fitbit('0220d917aac34298b6943dbd78ec2381', '5f0e3c5377694848a6fde6913d31ccb9', {});

  client.getRequestToken(function (err, token, tokenSecret) {
    if (err) {
      console.log(err);
      return;
    }

    req.session.oauth = {
        requestToken: token
      , requestTokenSecret: tokenSecret
    };
    tt = res.redirect(client.authorizeUrl(token));
  });
});

// On return from the authorization
app.get('/oauth_callback', function (req, res) {
  var verifier = req.query.oauth_verifier
    , oauthSettings = req.session.oauth
    , client = new Fitbit('0220d917aac34298b6943dbd78ec2381', '5f0e3c5377694848a6fde6913d31ccb9');

  // Request an access token
  client.getAccessToken(
      oauthSettings.requestToken
    , oauthSettings.requestTokenSecret
    , verifier
    , function (err, token, secret) {
        if (err) {
          console.log(err);
          return;
        }
        oauthSettings.accessToken = token;
        oauthSettings.accessTokenSecret = secret;
		console.log("redirect to stats");
        res.redirect('/steps');
      }
  );
  tokenS = oauthSettings.requestToken;
tokenSS = oauthSettings.requestTokenSecret;
verifierS = verifier;
});

app.get('/steps3', function(req, res) {

client = new Fitbit(
      '0220d917aac34298b6943dbd78ec2381'
    , '5f0e3c5377694848a6fde6913d31ccb9'
    , { // Now set with access tokens
          accessToken: req.session.oauth.accessToken
        , accessTokenSecret: req.session.oauth.accessTokenSecret
        , unitMeasure: 'en_GB'
      }
  );
client.apiCall2("https://api.fitbit.com/1/user/-/activities/date/2015-01-01.json", function(data){
console.log("MAIN " + data );
	res.send(data);	
});
 
});


// Display some stats
app.get('/steps', function (req, res) {
  client = new Fitbit(
      '0220d917aac34298b6943dbd78ec2381'
    , '5f0e3c5377694848a6fde6913d31ccb9'
    , { // Now set with access tokens
          accessToken: req.session.oauth.accessToken
        , accessTokenSecret: req.session.oauth.accessTokenSecret
        , unitMeasure: 'en_GB'
      }
  );

  // Fetch todays activities
  client.getActivities(function (err, activities) {
    if (err) {
      console.log(err);
      return;
    }

    // `activities` is a Resource model
    res.send('Total steps today: ' + activities.totalDistance());
  });
});

app.get('/steps2', function (req, res) {
  client = new Fitbit(
      '0220d917aac34298b6943dbd78ec2381'
    , '5f0e3c5377694848a6fde6913d31ccb9'
    , { // Now set with access tokens
          accessToken: tokenS
        , accessTokenSecret: tokenSS
        , unitMeasure: 'en_GB'
      }
  );

  // Fetch todays activities
  client.getActivities(function (err, activities) {
    if (err) {
      console.log(err);
      return;
    }

    // `activities` is a Resource model
    res.send('Total steps today: ' + activities.totalDistance());
  });
});