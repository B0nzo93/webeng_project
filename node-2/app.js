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
app.delete('/notes/:id', function (req, res) {
	deleteNote(req, res);
});
app.delete('/category/:id', function (req, res) {
	deleteCategory(req, res);
});
app.post('/notes/', function (req, res) {
	createNote(req, res);
});

function deleteNote(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var id = req.params.id
		var sql = "DELETE FROM todo WHERE id="+id
		con.query(sql, function(err, rows) {
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

function deleteCategory(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var id = req.params.id
		var sql = "DELETE FROM category WHERE id="+id
		con.query(sql, function(err, rows) {
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

function createNote(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var sql = ""
		con.query(sql, function(err, rows) {
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