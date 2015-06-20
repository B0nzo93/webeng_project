var express = require("express");
var bodyParser = require('body-parser');



function writeDBError(res, err) {
	console.error(err);
	res.status(500).json({code: 100, message: "Could not fetch data from db", error: err});
}
function errorhandler(res) {
	return function(err) {
		writeDBError(res, err);
	}
}

function isEmpty(obj) {
	// null and undefined are "empty"
	if (obj == null) return true;
	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length > 0)    return false;
	if (obj.length === 0)  return true;
	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}

module.exports = function(app, db){
	app.use(bodyParser.text({type:"*/*"})); //accept all types
	app.use(express.static('static'));

	app.get('/categories', function (req, res) {
		console.log("Request: GET /categories");
		db.query("SELECT name FROM category", [],
			errorhandler(res),
			function(rows) {
				var names = [];
				for (i in rows) {
					names.push(rows[i].name);
				}
				console.log("Response: [" + names + "]");
				res.status(200).json(names);
			});
	});

	app.get('/categories/:name', function (req, res) {
		console.log("Request: GET /categories/" + req.params.name);
		db.query("SELECT name FROM category WHERE name = ?", req.params.name,
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					console.log("Response: 404: " + JSON.stringify({success: false, message: "Category " + req.params.name + " not found."}));
					res.status(404).json({success: false, message: "Category " + req.params.name + " not found."});
				} else {
					db.query("SELECT * FROM todo WHERE category_id IN (SELECT name FROM category WHERE name = ?)",
						req.params.name,
						errorhandler(res),
						function(rows) {
							var names = [];
							for (i in rows) {
								names.push(rows[i].name);
							}
							console.log("Response: [" + names + "]");
							res.status(200).json(names);
						});
				}

			});

	});

	app.put('/categories/:name', function (req, res) {
		console.log("Request: PUT /categories/" + req.params.name);
		db.query("INSERT IGNORE INTO category (name) VALUES (?)", req.params.name,
			errorhandler(res),
			function(rows) {
				// console.log(rows);	
				if(rows.insertId) {
					console.log("Response:" + JSON.stringify({success: "true", category_id: rows.insertId}));
					res.status(200).json({success: true, category_id: rows.insertId});
				} else {
					db.query("SELECT id FROM category WHERE name=?", req.params.name,
						errorhandler(res),
						function(rows) {
							console.log("Response: " + JSON.stringify({success: "false", message: "category " + req.params.name + " already existing", category_id : rows[0].id}));
							res.status(200).json({success: false, message: "category " + req.params.name + " already existing", category_id : rows[0].id});
						});
				}
			});
	});

	app.delete('/categories/:name', function (req, res) {
		console.log("Request: DELETE /categories/" + req.params.name);
		db.query("DELETE FROM category WHERE name=? LIMIT 1", req.params.name,
			errorhandler(res),
			function(rows) {
				console.log("Response: " + JSON.stringify({success: true, message: "Category " + req.params.name + " deleted"}));
				res.status(200).json({success: true, message: "Category " + req.params.name + " deleted"});
				// res.status(200).send("deleted "+req.params.name);
			});
	});

	app.post('/categories/:name', function (req, res) {
		console.log("Request: POST /categories/" + req.params.name + " | " + req.body);
		console.log("POST body: " + req.body);
		if(!isEmpty(req.body)) {
			db.query("SELECT name FROM category WHERE name = ?", req.params.name,
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					console.log("Response: 404: " + JSON.stringify({success: false, message: "Category " + req.params.name + " not found."}));
					res.status(404).json({success: false, message: "Category " + req.params.name + " not found."});
				} else {
					db.query("UPDATE category SET name=? WHERE name=? LIMIT 1", [req.body, req.params.name],
						errorhandler(res),
						function(rows) {
							console.log("Response: " + JSON.stringify({success: true, message: "Category " + req.params.name + " renamed to " + req.body}));
							res.status(200).json({success: true, message: "Category " + req.params.name + " renamed to " + req.body});
					});
				}
			});
		} else {
			console.log("req.body is empty");
			console.log("Response: 400: " + JSON.stringify({success: false, message: "new name in POST body required"}));
			res.status(400).json({success: false, message: "new name in POST body requiered"});
		}
	});
}