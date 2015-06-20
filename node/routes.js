var express = require("express");

function writeDBError(res, err) {
	console.error(err);
	res.status(500).json({code: 100, message: "Could not fetch data from db", error: err});
}

module.exports = function(app, db){
	app.use(express.static('static'));

	app.get('/categories', function (req, res) {
		console.log("Request: GET /categories");
		db.query("SELECT name FROM category", [],
			function(err) {writeDBError(res, err);},
			function(rows) {
				var names = [];
				for (i in rows) {
					names.push(rows[i].name);
				}
				console.log("Response: [" + names + "]");
				res.json(names);
			});
	});
	app.get('/categories/:name', function (req, res) {
		console.log("Request: GET /categories/" + req.params.name);
		db.query("SELECT name FROM category WHERE name = ?", req.params.name,
			function(err) {writeDBError(res, err);},
			function(rows) {
				if(rows.length == 0) {
					console.log("Response: 404: Category " + req.params.name + " not found.");
					res.status(404).send("Category " + req.params.name + " not found.");
				}
				else{
					db.query("SELECT * FROM todo WHERE category_id IN (SELECT name FROM category WHERE name = ?)",
						req.params.name,
						function(err) {writeDBError(res, err);},
						function(rows) {
							var names = [];
							for (i in rows) {
								names.push(rows[i].name);
							}
							console.log("Response: [" + names + "]");
							res.json(names);
						});
				}

			});

	});
	app.put('/categories/:name', function (req, res) {
		console.log("Request: PUT /categories/" + req.params.name);
		db.query("INSERT IGNORE INTO category (name) VALUES (?)", req.params.name,
			function(err) {writeDBError(res, err);},
			function(rows) {
				// console.log(rows);	
				if(rows.insertId) {
					console.log("Response:" + JSON.stringify({success: "true", category_id: rows.insertId}));
					res.json({success: "true", category_id: rows.insertId});
				} else {
					db.query("SELECT id FROM category WHERE name=?", req.params.name,
						function(err) {writeDBError(res, err);},
						function(rows) {
							console.log("Respone: " + JSON.stringify({success: "false", message: "category " + req.params.name + " already existing", category_id : rows[0].id}));
							res.json({success: "false", message: "category " + req.params.name + " already existing", category_id : rows[0].id});
						});
				}
			});
	});
	app.delete('/categories/:name', function (req, res) {
		db.query("DELETE FROM category WHERE name=? LIMIT 1", req.params.name,
			function(err) {writeDBError(res, err);},
			function(rows) {
				console.log(rows);
				res.status(200).send("deleted "+req.params.name);
			});
	});
	app.post('/categories/:name', function (req, res) {
		if(req.body) {
			//TODO 404
			db.query("UPDATE category SET name=? WHERE name=? LIMIT 1", [req.body, req.params.name],
				function(err) {writeDBError(res, err);},
				function(rows) {
					console.log(rows);
					res.status(200).send("renamed "+req.params.name+" to "+req.body);
				});
		} else {
			//TODO missing arg
		}
	});
}