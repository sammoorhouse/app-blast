//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License"). 
//You may not use this file except in compliance with the License. 
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed 
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
//either express or implied. See the License for the specific language 
//governing permissions and limitations under the License.

//Get modules.
var express = require('express')();
var swig = require('./swig.min.js');
var http = require('http');
var routes = require('./routes');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.engine('html', swig.renderFile);
//app.set('views', __dirname + '/views')


//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({
	region: config.AWS_REGION
});

//GET home page.
app.get('/', routes.index);

//GET resolve
app.get('/resolve', function(req, res) {
	var appIdField = req.query.appId;
	console.log('resolving', appIdField);
	resolve(appIdField, function(data) {
		console.log('got data ', data);
		//res.render('template', data);
		res.send(data)
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
			console.log('Got data:', data);
			cb(data)
		}
	});
};

//app.get('/add')

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
