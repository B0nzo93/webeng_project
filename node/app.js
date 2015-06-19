var express = require('express');
var app = express();

app.use(express.static('static'));

app.get('/categories', function (req, res) {
	res.send('Test test!');
});
app.get('/categories/{name}', function (req, res) {
	res.send('Test test!');
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ToDo App listening at http://%s:%s', host, port);
});