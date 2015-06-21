module.exports = {};

function errorhandler(res, con) {
	return function(err, rows) {
		con.release();
		if (err) {
			console.error(err);
			res.status(400).send("Error on SQL execution.");
		} else {
			res.status(200).json(rows);
		}
	}
}

function connectAndQuery(req, res, callback) {
	module.exports.mysql.getConnection(function(err, con) {
		if (err) {
			if(con) {
				con.release();
			}
			console.error(err);
			res.status(500).send("Database error.");
		} else {
			callback(req, res, con);
		}
	});
}

/**
* This function selects all categories in the databse extracted from a request.
*
* @param {req} request
* @param {res} response 
*/
module.exports.selectAll = function selectAllCategories(req, res) {
	connectAndQuery(req, res, function(req, res, con) {
		var query = module.exports.squel.select()
										.from("category");
		con.query(query.toString(), errorhandler(res, con));
	});
};

/**
* This function deletes a category in the database extracted from a request.
*
* @param {req} request
* @param {res} response
*/
module.exports.delete = function deleteCategory(req, res) {

	connectAndQuery(req, res, function(req, res, con){
		var id = req.params.id;
		var query = module.exports.squel.delete()
										.from("category")
										.where("id=?", id);
		con.query(query.toString(), errorhandler(res, con));
	});
};

/**
* This function creates a category in the database extracted from a request.
*
* @param {req} request
* @param {res} response
*/
module.exports.create = function createCategory(req, res) {

	connectAndQuery(req, res, function(req, res, con){
		var name = req.params.name;	
		var query = module.exports.squel.insert()
										.into("category")
									  	.set("id", null)
									  	.set("name", name);
		con.query(query.toString(), errorhandler(res, con));
	});
};

/**
* This function updates a category in the database extracted from a request.
*
* @param {req} request
* @param {res} response
*/
module.exports.update = function updateCategory(req, res) {

	connectAndQuery(req, res, function(req, res, con){
		var name = req.params.name;
		var new_name = req.body.new_name;
		var query = module.exports.squel.update()
										.table("category")
										.set("name", new_name)
										.where("name=?", name);
		con.query(query.toString(), errorhandler(res, con));
	});
};