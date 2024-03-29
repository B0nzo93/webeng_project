module.exports = function(app, mysql, squel) {
	var category = require('./controllers/category');
	var note = require('./controllers/note');
	category.mysql = mysql;
	note.mysql = mysql;
	category.squel = squel;
	note.squel = squel;

	// REST CRUD category
	app.put('/categories/:name', function (req, res) {
		category.create(req, res);
	});
	app.get('/categories', function (req, res) {
		category.selectAll(req, res);
	});
	app.post('/categories/:id', function (req, res) {
		category.update(req, res);
	});
	app.delete('/categories/:id', function (req, res) {
		category.delete(req, res);
	});

	// REST CRUD note
	app.put('/notes', function (req, res) {
		note.create(req, res);
	});
	app.get('/notes', function (req, res) {
		note.selectAll(req, res);
	});
	app.get('/notes/:id', function (req, res) {
		note.select(req, res);
	});
	app.post('/notes/:id', function (req, res) {
		note.update(req, res);
	});
	app.delete('/notes/:id', function (req, res) {
		note.delete(req, res);
	});
}