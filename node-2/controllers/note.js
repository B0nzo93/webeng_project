module.exports = {};

function errorhandler(res, con) {
	return function(err, rows) {
		con.release();
		if (err) {
			console.error(err);
			res.status(400).send("Error on query execution.");
		} else {
			res.status(200).json(rows);
		}
	}
}

/**
* This function deletes a note in the databse extractec from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.delete = function deleteNote(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var id = req.params.id;
		var query = module.exports.squel.delete()
						.from("todo")
						.where("id=?", id);
		con.query(query.toString(), errorhandler(res, con));
	}
	});
};


/**
* This function gets a certain note in the databse extracted from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.select = function selectNote(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var id = req.params.id;
		var query = module.exports.squel.select()
						.from("todo")
						.where("id=?", id);
		con.query(query.toString(), function(err, rows) {
			con.release();
			if (err) {
				console.error(err);
				res.status(400).send("Error on query execution.");
			} else {
				if (rows.length == 1) {
					res.status(200).json(rows[0]);
				} else {
					res.status(400).send("Invalid id");
				}
			}
		});
	}
	});
};


/**
* This function deletes a note in the databse extracted from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.create = function createNote(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var title = req.body.title || "";
		var description = req.body.description || "";
		var created = req.body.created;
		var done = req.body.done;
		var category_id = req.body.category_id;

		// check if there was given a category id, else add uncategorized note
		if (category_id == "") {
			category_id = null;
		}

		var sql = module.exports.squel.insert()
						.into("todo")
						.set("description", description)
						.set("title", title)
						.set("created", created)
						.set("done", done)
						.set("category_id", category_id);
		con.query(sql.toString(), errorhandler(res, con));
	}
	});
};


/**
* This function selects all notes and their corresponding category ids and names
* in the databse extracted from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.selectAll = function selectAllNotes(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.status(500).send("Database error");
	} else {
		var query = module.exports.squel.select()
										.from("todo", "t")
										.left_join("category", "c", "t.category_id = c.id")
										.field("t.id")
										.field("t.title")
										.field("t.description")
										.field("t.created")
										.field("t.done")
										.field("c.id", "category_id")
										.field("c.name", "category_name");
		con.query(query.toString(), errorhandler(res, con));
	}
	});
};


/**
* This function updates a note in the databse extracted from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.update = function updateNote(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var id = req.params.id;
		var title = req.body.title || "";
		var description = req.body.description || "";
		var created = req.body.created;
		var done = req.body.done;
		var category_id = req.body.category_id;

		// check if there was given a category id, else add uncategorized note
		if (category_id == "") {
			category_id = null;
		}

		var query = module.exports.squel.update()
										.table("todo")
										.set("title", title)
										.set("description", description)
										.set("created", created)
										.set("done", done)
										.set("category_id", category_id)
										.where("id=?", id);		
		con.query(query.toString(), errorhandler(res, con));
	}
	});
};