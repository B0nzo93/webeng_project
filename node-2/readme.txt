My Todo Notes Readme 
====================
====================


Webapplication Setup
====================
1.	First extract the source code to a folder of your choice
2.	Download and install nodejs (https://nodejs.org/download/)
3.	Install the node package manger (npm)
4. 	Install the following packages with 'npm install'
		- express
		- mysql
		- squel
		- body-parser
5. 	Setup a MySQL database and import the 'dump.sql' SQL dump to the this database
6.	Configurate the 'mysql.js' file with your database connection details
7. 	Start the webserver with: node app.js
8.	Call 'http://localhost:3000/view.html' in your browser
9. 	Have fun ;-)


Application structure
=====================
Backend: Node.js, MySQL (database), express (routing), body-parser, squel (SQL builder)
Frontend: HTML5 + REST, jQuery (asynchronoues requests, DOM manipulation), Bootstrap (CSS Components)

The application uses nodejs and therefore javascript on the server side. The backend provides a restfule API for CRUD-operations on notes and categories. The REST API requests of the clients are received, parsed and checked on the server and bound to a certain CRUDE-operation for an model object. This routing is done in the routing.js file. In this file the controller function for notes and categories are called. They dynamically build SQL statesments for editing the model data in the database. 
The clients send the API calls by asynchronous AJAX-request (via jQuery) to the server.If the client has received the response of the server in JSON-format (positive case, in negative case a HTTP error code is sent) it will update the DOM-structure dynamically by using jQuery. For displaying the notes and categories Boostrap components and CSS is used.