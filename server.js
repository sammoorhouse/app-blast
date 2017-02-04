var env = process.env.NODE_ENV || 'dev';

console.log('loading .env')
require('dotenv').config({
	silent: true
});

var express = require('express');
var http = require('http');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var config = {
	userName: process.env.database_username,
	password: process.env.database_password,
	server: process.env.database_hostname,
	options: {
		encrypt: true,
		database: process.env.database_name,
		useColumnNames: true
	}
};

var connection = new Connection(config);

var app = express();
app.set('port', process.env.PORT || 3000);

app.get('/res/:id', (req, res) => {
	var id = req.params.id
	var ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress
	var ua = req.headers['user-agent']

	request = new Request("SELECT a.appId, a.googlePlayStoreId, a.appleStoreId, a.windowsStoreId FROM apps AS a where appId = " + id,
		function (err, rowCount) {
			if (err) {
				console.log(err);
				res.redirect('/') //really?
			} else {
				//log?
				//perform insert
				var query = "INSERT INTO reqs(timestamp, appId, ip, os) VALUES ( @timestamp , @appId, @ip, @os)";

				var insert = new Request(query, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log('done')
					}
				});

				insert.addParameter('timestamp', TYPES.DateTime, new Date());
				insert.addParameter('appId', TYPES.Int, id);
				insert.addParameter('ip', TYPES.VarChar, ip);
				insert.addParameter('os', TYPES.VarChar, ua.substring(0, process.env.os_column_length));

				connection.execSql(insert);
			}
		});

	request.on('row', function (columns) {
		if (/like Mac OS X/.test(ua)) {
			res.redirect('https://itunes.apple.com/us/app/' + columns.appleStoreId.value)
		} else if (/Android/.test(ua)) {
			res.redirect('https://play.google.com/store/apps/details?id=' + columns.googlePlayStoreId.value)
		} else {
			res.redirect('https://itunes.apple.com/us/app/' + columns.appleStoreId.value)
		}
	});

	connection.execSql(request);
})

connection.on('connect', function (err) {
	if (err) {
		console.log(err)
	} else {
		console.log("connected to db")
		http.createServer(app).listen(app.get('port'), function () {
			console.log('Express server listening on port ' + app.get('port'));
		});
	}
});