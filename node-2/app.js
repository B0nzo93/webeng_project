// Connect to database
var mysql = require("mysql");
var pool  = mysql.createPool(require("./mysql.js"));

pool.on('error', function(err) {
	errorCallback(err);
});

// Define routes
var express = require("express");
var app     = express();

app.use(express.static("static"));
app.get('/notes', function (req, res) {
	selectAllNotes(req, res);
});


/*
app.get('/:name', function (req, res) {
	res.send("Hello "+req.params.name+"!");
});
*/

function selectAllNotes(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		con.query("SELECT t.id, t.title, t.description, t.created, t.done, c.id as category_id, c.name as category_name FROM todo t JOIN category c ON t.category_id = c.id", function(err, rows) {
			con.release();
			if (err) {
				//errorCallback(err);
			} else {
				//successCallback(rows);
				res.json(rows);
			}
		});
	}
});
}

// Start
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});