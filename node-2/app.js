// Connect to database
var mysql = require("mysql");
var pool  = mysql.createPool(require("./mysql.js"));

pool.on('error', function(err) {
	errorCallback(err);
});

// Define routes
var express = require("express");
var app     = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json({type: "*/*"}));


app.use(express.static("static"));
app.get('/notes', function (req, res) {
	selectAllNotes(req, res);
});
app.delete('/notes/:id', function (req, res) {
	deleteNote(req, res);
});
app.delete('/categories/:id', function (req, res) {
	deleteCategory(req, res);
});
app.put('/notes/', function (req, res) {
	createNote(req, res);
});
app.put('/categories/:name', function (req, res) {
	createCategory(req, res);
});
app.post('/categories/:name', function (req, res) {
	updateCategory(req, res);
});
app.post('/notes/', function (req, res) {
	updateNote(req, res);
});

function deleteNote(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var id = req.params.id;
		var sql = "DELETE FROM todo WHERE id="+id;
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
		var title = req.body.title;
		var description = req.body.description;
		var created = req.body.created;
		var done = req.body.done;
		var category_id = req.body.category_id;

		var sql = "INSERT INTO todo (id, description, title, created, done, category_id) " 
					+ 'VALUES (NULL,"' + description + '","' + title + '","' + created +  '",' + done + ',' + category_id + ');';
		console.log(sql);
		con.query(sql, function(err, rows) {
			con.release();
			if (err) {
				console.log(err);
				//errorCallback(err);
			} else {
				//successCallback(rows);
				res.json(rows);
			}
		});
	}
	});
}

function createCategory(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var name = req.params.name;
		var sql = 'INSERT INTO category (id, name) VALUES (NULL,"' + String(name) + '");';
		con.query(sql, function(err, rows) {
			con.release();
			if (err) {
				console.log(err);
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

function updateCategory(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var id = req.body.id;
		var new_name = req.body.name;

		var sql = 'UPDATE category SET name="' + String(new_name) + '" WHERE id=' + id;
		con.query(sql, function(err, rows) {
			con.release();
			if (err) {
				console.log(err);
				//errorCallback(err);
			} else {
				//successCallback(rows);
				res.json(rows);
			}
		});
	}
	});
}

function updateNote(req, res) {
	pool.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		//errorCallback(err);
	} else {
		var id = req.body.id;
		var title = req.body.title;
		var description = req.body.description;
		var created = req.body.created;
		var done = req.body.done;
		var category_id = req.body.category_id;

		var sql = 'UPDATE todo SET title="' + title + '", ' +
										'description="'+ description + '", ' +
										'created="' + created +'", ' +
										'done=' + done + ', ' +
										'category_id=' + category_id + ' WHERE id=' + id;
		console.log(sql);
		con.query(sql, function(err, rows) {
			con.release();
			if (err) {
				console.log(err);
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