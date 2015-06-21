var express = require("express");
var bodyParser = require('body-parser');

function writeDBError(res, err) {
	console.error(err);
	res.status(500).json({success: false, message: "Could not fetch data from db", error: err});
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
	function sendNoteData(res, noteId) {
		db.query("SELECT * FROM todo_category WHERE id = ?", noteId, 
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					//if the note with the given id does not exist, respond with a 404 page
					var json = {success: false, message: "Note with id = " + req.params.id + " not found."};
					console.log("Response: 404: " + JSON.stringify(json));
					res.status(404).json(json);
				} else {
					console.log("Response: " + JSON.stringify(rows[0]));
					res.status(200).json(rows[0]);
				}
			}
		);
	}

	app.use(bodyParser.json( {type: "*/*"} ));
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
			}
		);
	});

	app.get('/categories/:name', function (req, res) {
		console.log("Request: GET /categories/" + req.params.name);
		// First, check if the category with the given name exists
		db.query("SELECT name FROM category WHERE name = ?", req.params.name,
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					// If the given category does not exists, respont with a 404 page
					var json = {success: false, message: "Category " + req.params.name + " not found."};
					console.log("Response: 404: " + JSON.stringify(json));
					res.status(404).json(json);
				} else {
					// Then, get the notes for this category
					db.query("SELECT * FROM todo WHERE category_id IN (SELECT id FROM category WHERE name = ?)",
						req.params.name,
						errorhandler(res),
						function(rows) {
							var names = [];
							for (i in rows) {
								names.push(rows[i].name);
							}
							console.log("Response: [" + names + "]");
							res.status(200).json(names);
						}
					);
				}

			}
		);

	});

	app.put('/categories/:name', function (req, res) {
		console.log("Request: PUT /categories/" + req.params.name);
		db.query("INSERT IGNORE INTO category (name) VALUES (?)", req.params.name,
			errorhandler(res),
			function(rows) {
				if(rows.insertId) {
					console.log("Response:" + JSON.stringify({success: "true", category_id: rows.insertId}));
					res.status(200).json({success: true, category_id: rows.insertId});
				} else {
					db.query("SELECT id FROM category WHERE name=?", req.params.name,
						errorhandler(res),
						function(rows) {
							console.log("Response: " + JSON.stringify({success: "false", message: "category " + req.params.name + " already existing", category_id : rows[0].id}));
							res.status(200).json({success: false, message: "category " + req.params.name + " already existing", category_id : rows[0].id});
						}
					);
				}
			}
		);
	});

	app.delete('/categories/:name', function (req, res) {
		console.log("Request: DELETE /categories/" + req.params.name);
		// First, check if the category with the given name exists
		db.query("SELECT name FROM category WHERE name = ?", req.params.name,
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					// If the given category does not exists, respont with a 404 page
					var json = {success: false, message: "Category " + req.params.name + " not found."};
					console.log("Response: 404: " + JSON.stringify(json));
					res.status(404).json(json);
				} else {
					// Then, delete all notes that are associated with this category
					db.query("DELETE FROM todo WHERE category_id=(SELECT id FROM category WHERE name=?)", req.params.name,
						errorhandler(res), 
						function(rows) {
							// Then, delete the category itself
							db.query("DELETE FROM category WHERE name=? LIMIT 1;", req.params.name,
								errorhandler(res),
								function(rows) {
									console.log("Response: " + JSON.stringify({success: true, message: "Category " + req.params.name + " deleted"}));
									res.status(200).json({success: true, message: "Category " + req.params.name + " deleted"});
								}
							);
						}
					);
				}
			});
		});

	app.post('/categories/:name', function (req, res) {
		console.log("Request: POST /categories/" + req.params.name + " | " + JSON.stringify(req.body));
		if(!isEmpty(req.body)) {
			db.query("SELECT name FROM category WHERE name = ?", req.params.name,
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					console.log("Response: 404: " + JSON.stringify({success: false, message: "Category " + req.params.name + " not found."}));
					res.status(404).json({success: false, message: "Category " + req.params.name + " not found."});
				} else {
					var newName = req.body.name;
					db.query("UPDATE category SET name=? WHERE name=? LIMIT 1", [newName, req.params.name],
						errorhandler(res),
						function(rows) {
							var json = {success: true, message: "Category " + req.params.name + " renamed to " + newName};
							console.log("Response: " + JSON.stringify(json));
							res.status(200).json(json);
						}
					);
				}
			}
			);
		} else {
			console.log("req.body is empty");
			var json = {success: false, message: "new name in POST body required"};
			console.log("Response: 400: " + JSON.stringify(json));
			res.status(400).json(json);
		}
	});


	app.get('/notes', function (req, res) {
		console.log("Request: GET /notes");
		db.query("SELECT * FROM todo_category", [],
			errorhandler(res),
			function(rows) {
				console.log("Response: " + JSON.stringify(rows));
				res.status(200).json(rows);
			});
	});

	app.get('/notes/:id', function (req, res) {
		console.log("Request: GET /notes/" + req.params.id);
		sendNoteData(res, req.params.id);
	});

	app.put('/notes', function (req, res) {
		console.log("Request: PUT /notes/ | " + JSON.stringify(req.body));
		var description = req.body.description || "";
		var title = req.body.title || "";
		var created = req.body.date;
		var isDone = req.body.done ? 1 : 0;
		var category_name = req.body.category;

		// First, check if the category with the given name exists
		db.query("SELECT name FROM category WHERE name = ?", category_name,
			errorhandler(res),
			function(rows) {
				if(rows.length == 0) {
					// If the given category does not exists, respont with a 404 page
					var json = {success: false, message: "Category " + category_name + " not found."};
					console.log("Response: 404: " + JSON.stringify(json));
					res.status(404).json(json);
				} else {
					// Then, to whatever
					db.query("INSERT INTO todo (description, title, created, done, category_id) VALUES(?, ?, ?, ?, (SELECT category.id FROM category WHERE category.name = ? LIMIT 1))", [description, title, created, isDone, category_name],
						errorhandler(res),
						function(rows) {
							// after inserting a new note, get its id and then retrieve the values to show the complete note, as with a GET request
							var insertId = rows.insertId;
							if(insertId == 0) {
								// If insertId == 0, no then the INSERT failed (reason could be, that no category with the given category name exists.)
								var json = {success: false, message: "Error: No note has been inserted."};
								console.log("Response: " + JSON.stringify(json));
								res.status(500).json(json);
							} else {
								sendNoteData(res, insertId);
							}
						}
					);
				}
			}
		);
	});

	app.delete('/notes/:id', function (req, res) {
		console.log("Request: DELETE /note/" + req.params.id);
		db.query("DELETE FROM todo WHERE id=? LIMIT 1", req.params.id,
			errorhandler(res),
			function(rows) {
				var json = {success: true, message: "Note " + req.params.id + " deleted"};
				console.log("Response: " + JSON.stringify(json));
				res.status(200).json(json);
			});
	});

	app.post('/notes/:id', function (req, res) {
		console.log("Request: POST /notes/" + req.params.id + " | " + JSON.stringify(req.body));
		if(!isEmpty(req.body)) {
			//check if the note with the given id exists at all
			db.query("SELECT id FROM todo WHERE id = ?", req.params.id,
				errorhandler(res),
				function(rows) {
					if(rows.length == 0) {
						//if it does not exist, respond with an 404 page
						var json = {success: false, message: "Note with id = " + req.params.id + " not found."};
						console.log("Response: 404: " + JSON.stringify());
						res.status(404).json(json);
					} else {
						//if the note with the given id exists, extract the new values from the POST body and perform an update on the database
						var newDescription = req.body.description || "";
						var newTitle = req.body.title || "";
						var newCreated = req.body.date; // or req.body.created ??
						var newDone = req.body.done;
						var newCategoryName = req.body.category || "";
						var noteId = req.params.id;

						if (newCategoryName) {
							// check if the category with the given name exists
							db.query("SELECT name FROM category WHERE name = ?", newCategoryName,
								errorhandler(res),
								function(rows) {
									if(rows.length == 0) {
										// If the given category does not exist, respond with a 400 page
										var json = {success: false, message: "Category " + newCategoryName + " not found."}
										console.log("Response: 400: " + JSON.stringify(json));
										res.status(400).json(json);
									} else {
										// If the new category does exist, perform the UPDATE
										// UPDATE todo SET category_id=(SELECT id FROM category WHERE name = 'test10') WHERE id = 3
										db.query("UPDATE todo SET description=?, title=?, created=?, done=?, category_id=(SELECT id FROM category WHERE name = ?) WHERE id = ? LIMIT 1", [newDescription, newTitle, newCreated, newDone, newCategoryName, noteId],
											errorhandler(res),
											function(rows) {
												// After the UPDATE, perform a SELECT to retrieve the new values and show the complete note, as with a GET request
												sendNoteData(res, noteId);
											}
										);

									}
								}
							);	
						} else {
							// If no category is set, perform the update with category = NULL
							db.query("UPDATE todo SET description=?, title=?, created=?, done=?, category_id=NULL WHERE id = ? LIMIT 1", [newDescription, newTitle, newCreated, newDone, newCategoryName, noteId],
								errorhandler(res),
								function(rows) {
									// After the UPDATE, perform a SELECT to retrieve the new values and show the complete note, as with a GET request
									sendNoteData(res, noteId);
								}
							);
						}
					}
				}
			);
		} else {
			console.log("req.body is empty");
			var json = {success: false, message: "Empty POST body. Please provide all attributes in the POST body."};
			console.log("Response: 400: " + JSON.stringify(json));
			res.status(400).json(json);
		}
	});
}