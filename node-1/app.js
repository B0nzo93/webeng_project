var express = require("express");
var app     = express();

// Connect to database
var db      = require("./mysql.js");

// Define routes
require("./routes.js")(app, db);

// Start
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});