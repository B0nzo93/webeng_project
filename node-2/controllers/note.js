module.exports = {};

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
		var sql = "DELETE FROM todo WHERE id="+id;
		con.query(sql, function(err, rows) {
			con.release();
			if (err) {
				console.error(err);
				res.sendStatus(404);
			} else {
				res.sendStatus(200);
				res.status.json(rows);
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
		var title = req.body.title;
		var description = req.body.description;
		var created = req.body.created;
		var done = req.body.done;
		var category_id = req.body.category_id;

		// check if there was given a category id, else add uncategorized note
		if (category_id || category_id == "") {
			category_id = "NULL";
		}

		var sql = "INSERT INTO todo (id, description, title, created, done, category_id) " 
					+ 'VALUES (NULL,"' + description + '","' + title + '","' + created +  '",' + done + ',' + category_id + ');';
		console.log(sql);
		con.query(sql, function(err, rows) {
			con.release();
			if (err) {
				console.error(err);
				res.sendStatus(400, "Check the type and structure of your request");
			} else {
				res.status(200).json(rows);
			}
		});
	}
	});
};


/**
* This function selects all notes in the databse extracted from a request.
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
		res.sendStatus(500, "Database error");
	} else {
		con.query("SELECT t.id, t.title, t.description, t.created, t.done, c.id as category_id, c.name as category_name FROM todo t JOIN category c ON t.category_id = c.id", function(err, rows) {
			con.release();
			if (err) {
				console.error(err);
				res.sendStatus(404);
			} else {
				res.status(200).json(rows);
			}
		});
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
				console.error(err);
				res.sendStatus(404);
			} else {
				res.status(200).json(rows);
			}
		});
	}
	});
};