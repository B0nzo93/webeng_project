var mysql = require("mysql");
var pool  = mysql.createPool(require("./mysql.conf.js"));

pool.on('error', function(err) {
	errorCallback(err);
});

module.exports = {
	pool: pool,
	mysql: mysql,
	query: function(query, values, errorCallback, successCallback) {
		pool.getConnection(function(err, con) {
			if (err) {
				if(con) {
					con.release();
				}
				errorCallback(err);
			} else {
				con.query(query, values, function(err, rows) {
					con.release();
					if (err) {
						errorCallback(err);
					} else {
						successCallback(rows);
					}
				});
			}
		});
	}
};