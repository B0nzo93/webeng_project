module.exports = {};


/**
* This function selects all categories in the databse extracted from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.selectAll = function selectAllCategories(req, res) {
	module.exports.mysql.getConnection(function(err, con) {
	if (err) {
		if(con) {
			con.release();
		}
		console.error(err);
		res.sendStatus(500, "Database error");
	} else {
		var query = module.exports.squel.select()
										.from("category");
		con.query(query.toString(), function(err, rows) {
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
		var id = req.params.id;
		var query = module.exports.squel.delete()
					.from("category")
					.where("id=?", id);
		con.query(query.toString(), function(err, rows) {
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
		var query = module.exports.squel.insert().into("category")
									  	.set("id", null)
									  	.set("name", name);
		con.query(query.toString(), function(err, rows) {
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
		var query = module.exports.squel.update()
							.table("category")
							.set("name", new_name)
							.where("name=?", name);
		con.query(query.toString(), function(err, rows) {
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