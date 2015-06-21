// Connect to database
var mysql = require("mysql");
var pool  = mysql.createPool(require("./mysql.js"));

pool.on('error', function(err) {
	console.error(err);
});

// Define routes and require external resources
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json({type: "*/*"}));
app.use(express.static("static"));
require('./routes')(app, pool);

// Start
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});
