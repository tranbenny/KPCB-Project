var express = require('express');
var app = express();
var mainPageRoutes = require('./app/routes/routes');
var api = require('./app/routes/apiRoutes');
// var bodyParser = require('body-parser');


app.use(express.static(__dirname + '/public'));
// app.use(bodyParser());

app.use('/', mainPageRoutes);
app.use('/api', api);

/*
app.get('/', function(req, res) {
	res.send('Hello World!');
});*/

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address.port;
	console.log("App listening on port: 3000");
});