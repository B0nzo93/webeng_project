module.exports = {};

/**
* This function deletes a category in the database extracted from a request.
*
* @param {req} request
* @param {res} response
*/
module.exports.delete = function deleteCategory(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var id = req.params.id
		var sql = "DELETE FROM category WHERE id="+id
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

/**
* This function creates a category in the database extracted from a request.
*
* @param {req} request
* @param {res} response
*/
module.exports.create = function createCategory(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var name = req.params.name;
		var sql = 'INSERT INTO category (id, name) VALUES (NULL,"' + String(name) + '");';
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
* This function updates a category in the database extracted from a request.
*
* @param {req} request
* @param {res} response
*/
module.exports.update = function updateCategory(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var name = req.params.name;
		var new_name = req.body.new_name;

		con.query('UPDATE category SET name=? WHERE name=?', [new_name, name], function(err, rows) {
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