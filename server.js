//Get modules.
var express = require('express');
var http = require('http');
var routes = require('./routes');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var jade = require('jade')
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
//app.use(app.router);


//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({
	region: config.AWS_REGION
});

//GET home page.
//app.get('/', routes.index);

//GET resolve
app.get('/resolve', function(req, res) {
	var appIdField = req.query.appId;
	console.log('resolving', appIdField);
	resolve(appIdField, function(data) {
		console.log('got data ', data);
		res.render('template', {data: data})
		//res.send(data)
	});
});

var resolve = function(appId, cb) {
	var params = {
		TableName: 'apps',
		Key: {
			"app_id": {
				"S": appId
			},
		}
	}
	db.getItem(params, function(err, data) {
		console.log('sent', params)
		if (err) {
			console.log('Error getting data from database: ', err);
			cb(err)
		} else {
			console.log('Got data: ', data);
			cb(data)
		}
	});
};

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});