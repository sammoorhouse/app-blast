//Get modules.
var express = require('express');
var http = require('http');
var path = require('path');
//var jade = require('jade')

var app = express();
app.set('port', process.env.PORT || 3000);

app.get('/res/:id', (req, res)=>{
//get datas

//redirect

window.location.replace('https://play.google.com/store/apps/details?id=12345);
})

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
