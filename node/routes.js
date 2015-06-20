var express = require("express");

function writeDBError(res, err) {
	console.error(err);
	res.status(500).json({code: 100, message: "Could not fetch data from db", error: err});
}

module.exports = function(app, db){
	app.use(express.static('static'));

	app.get('/categories', function (req, res) {
		db.query("SELECT name FROM category", [],
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
		db.query("SELECT * FROM todo WHERE group_id IN (SELECT name FROM category WHERE name = ?)", req.params.name,
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
		db.query("INSERT IGNORE INTO category (name) VALUES (?)", req.params.name,
			function(err) {writeDBError(res, err);},
			function(rows) {
				console.log(rows);
				if(rows.insertId) {
					res.send(rows.insertId+"");
				} else {
					db.query("SELECT id FROM category WHERE name=?", req.params.name,
						function(err) {writeDBError(res, err);},
						function(rows) {
							console.log(rows);
							res.send(rows[0].id+"");
						});
				}
			});
	});
	app.delete('/categories/:name', function (req, res) {
		db.query("DELETE FROM category WHERE name=? LIMIT 1", req.params.name,
			function(err) {writeDBError(res, err);},
			function(rows) {
				console.log(rows);
				res.status(200);
			});
	});
	app.post('/categories/:name', function (req, res) {
		if(req.body) {
			//TODO 404
			db.query("UPDATE category SET name=? WHERE name=? LIMIT 1", [req.body, req.params.name],
				function(err) {writeDBError(res, err);},
				function(rows) {
					console.log(rows);
					res.status(200);
				});
		} else {
			//TODO missing arg
		}
	});
}