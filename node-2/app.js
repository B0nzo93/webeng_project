// Connect to database
var mysql = require("mysql");
var pool  = mysql.createPool(require("./mysql.js"));

pool.on('error', function(err) {
	errorCallback(err);
});

pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		con.query(QUERY, VALUES, function(err, rows) {
			con.release();
			if (err) {
				//errorCallback(err);
			} else {
				//successCallback(rows);
			}
		});
	}
});

// Define routes
var express = require("express");
var app     = express();

app.get('/', function (req, res) {
	res.send("Hello World!");
});
app.get('/:name', function (req, res) {
	res.send("Hello "+req.params.name+"!");
});

// Start
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});