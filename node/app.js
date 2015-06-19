var express   =    require("express");
var mysql     =    require("mysql");
var app       =    express();

// MySQL
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : '10.0.0.112',
    user     : 'webeng',
    password : 'harald',
    database : 'webeng',
    debug    :  false
});
pool.on('error', function(err) {
	errorCallback(err);
});

function writeDBError(res, err) {
	console.error(err);
	res.status(500).json({code: 100, message: "Could not fetch data from db", error: err});
}
function query(query, values, errorCallback, successCallback) {
	pool.getConnection(function(err, con) {
		if (err) {
			if(con) {
				con.release();
			}
			errorCallback(err);
		} else {
			con.query(query, values, function(err, rows) {
				con.release();
				if (err) {
					errorCallback(err);
				} else {
					successCallback(rows);
				}
			});
		}
	});
}

// Routing
app.use(express.static('static'));

app.get('/categories', function (req, res) {
	query("SELECT name FROM category", [],
		function(err) {writeDBError(res, err);},
		function(rows) {
			var names = [];
			for (i in rows) {
				names.push(rows[i].name);
			}
			res.json(names);
		});
});
app.get('/categories/:name', function (req, res) {
	//TODO 404
	query("SELECT * FROM todo WHERE group_id IN (SELECT name FROM category WHERE name = ?)", req.params.name,
		function(err) {writeDBError(res, err);},
		function(rows) {
			var names = [];
			for (i in rows) {
				names.push(rows[i].name);
			}
			res.json(names);
		});
});
app.put('/categories/:name', function (req, res) {
	query("INSERT IGNORE INTO category (name) VALUES (?)", req.params.name,
		function(err) {writeDBError(res, err);},
		function(rows) {
			console.log(rows);
			if(rows.insertId) {
				res.send(rows.insertId+"");
			} else {
				query("SELECT id FROM category WHERE name=?", req.params.name,
					function(err) {writeDBError(res, err);},
					function(rows) {
						console.log(rows);
						res.send(rows[0].id+"");
					});
			}
		});
});
app.delete('/categories/:name', function (req, res) {
	query("DELETE FROM category WHERE name=? LIMIT 1", req.params.name,
		function(err) {writeDBError(res, err);},
		function(rows) {
			console.log(rows);
			res.status(200);
		});
});
app.post('/categories/:name', function (req, res) {
	if(req.body) {
		//TODO 404
		query("UPDATE category SET name=? WHERE name=? LIMIT 1", [req.body, req.params.name],
			function(err) {writeDBError(res, err);},
			function(rows) {
				console.log(rows);
				res.status(200);
			});
	} else {
		//TODO missing arg
	}
});

// Start
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});