/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { appTitle: 'A New Startup: Sign Up Today!'});
};

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var AWS = require('aws-sdk');
var colors = require('colors');
var express = require('express');
var router = express.Router();

var AWS_ACCOUNT_ID = '134264806612';
var AWS_Region = 'us-east-1';
var COGNITO_IDENTITY_POOL_ID = 'us-east-1:5f6a6be1-de0e-47e9-9e32-b1950d39c391 ';
var COGNITO_IDENTITY_ID, COGNITO_SYNC_TOKEN, AWS_TEMP_CREDENTIALS;
var cognitosync;
var IAM_ROLE_ARN = 'arn:aws:iam::134264806612:role/Cognito_appblastAuth_DefaultRole';
var COGNITO_SYNC_COUNT;
var COGNITO_DATASET_NAME = 'TEST_DATASET';
var FACEBOOK_APP_ID = '774129009350668';
var FACEBOOK_APP_SECRET = '89246382b78a9a375a8d681a56c2efea';
var FACEBOOK_TOKEN;
var FACEBOOK_USER = {
  id: '',
  first_name: '',
  gender: '',
  last_name: '',
  link: '',
  locale: '',
  name: '',
  timezone: 0,
  updated_time: '',
  verified: false
};
var userLoggedIn = false;
var cognitoidentity = new AWS.CognitoIdentity();

router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://app-blast.net/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {

  process.nextTick(function() {
    FACEBOOK_TOKEN = accessToken; 
    FACEBOOK_USER = profile._json;
    userLoggedIn = true;
    done(null, profile);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/* GET Facebook page. */
router.get('/auth/facebook', passport.authenticate('facebook'));

/* GET Facebook callback page. */
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

/* GET Facebook success page. */
router.get('/success', function(req, res, next) {
  console.log('FACEBOOK_TOKEN:'.green + FACEBOOK_TOKEN); 
  res.send('Logged in as ' + FACEBOOK_USER.name + ' (id:' + FACEBOOK_USER.id + ').');
});

/* GET Facebook error page. */
router.get('/error', function(req, res, next) {
  res.send("Unable to access Facebook servers. Please check internet connection or try again later.");
});