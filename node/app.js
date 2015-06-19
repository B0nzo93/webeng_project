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

function writeDBError(res, err) {
	console.error(err);
	res.status(500).json({code: 100, message: "Could not fetch data from db", error: err});
}

function fetch(query, success, res) {
	pool.getConnection(function(err, con) {
		if (err) {
			connection.release();
			writeDBError(res, err);
		} else {
			connection.on('error', function(err) {
				writeDBError(res, err);
			});
			connection.query(query, function(err, rows) {
				connection.release();
				if (err) {
					writeDBError(res, err);
				} else {
					success(rows);
				}
			});
		}
	});
}

// Routing
app.use(express.static('static'));

app.get('/categories', function (req, res) {
	res.send('Test test!');
});
app.get('/categories/:name', function (req, res) {
	pool.getConnection(function(err, con) {
		if (err) {
			if(con) {
				con.release();
			}
			writeDBError(res, err);
		} else {
			con.on('error', function(err) {
				writeDBError(res, err);
			});
			con.query("INSERT INTO `webeng`.`todonote` (`id`, `description`, `title`, `created`, `done`, `group_id`) VALUES (NULL, 'testdescription', 'testttitle', '2015-06-19', '0', '3');", req.params.name, function(err, rows) {
				con.release();
				if (err) {
					writeDBError(res, err);
				} else {
					res.send(rows);
				}
			});
		}
	});
});


// Start
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});