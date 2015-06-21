README.txt

Beschreibung der Applikationsstruktur

Model:

MySQL-Datenbank mit einem Schema laut ER-Diagramm.


Server:

node.js-Server, der die Anbindung an das Model (Datenbank) via einer RESTful API bereitstellt. Für ein einfaches Handling der Routen (GET/PUT/DELETE/POST mit den jeweiligen URLs) wird die Library express verwendet. Die Ausgabe erfolgt im Generellen im JSON-Format. Die API im folgenden kurz dokumentiert:

GET 	/categories

	Gibt eine Liste (JSON-Array) der Namen aller verfügbaren Kategorien zurück.

GET 	/categories/<name>

	Gibt eine Liste (JSON-Array mit jeweils einem JSON-Object pro ToDo-Note) der ToDo-Notes zurück, die der Kategorie mit dem Namen <name> zugeordnet sind.

PUT 	/categories/<name>

	Erstellt eine neue Kategorie mit dem Namen <name>.

DELETE 	/categories/<name>

	Löscht die Kategorie mit dem Namen <name>. Dabei werden auch alle ToDo-Notes gelöscht, die dieser Kategorie zugewiesen sind.

POST 	/categories/<name>

	Benennt die Kategorie mit dem Namen <name> um. Der neue Name muss im POST-Body als JSON-Object mit dem Key "name" stehen, z.B. {"name": "Neuer Name"}.

GET 	/notes

	Gibt eine Liste (JSON-Array mit jeweils einem JSON-Object pro ToDo-Note) aller ToDo-Notes zurück.

GET 	/notes/<id>

	Gibt ein JSON-Object der ToDo-Note mit der id <id> zurück.

PUT		/notes

	Erstellt eine neue ToDo-Note. Die Daten müssen als JSON-Object im Body stehen, z.B. {"description":"Durchtesten","title":"WebEng","date":"2015-05-20T22:00:00.000Z","done":false,"category":"Uni"}. Die erstellte ToDo-Note wird zurückgegeben.

DELETE 	/notes/<id>

	Löscht die ToDo-Note mit der id <id>.

POST 	/notes/<id>

	Bearbeitet die ToDo-Note mit der id <id>. Sämtliche Werte (egal ob geändert oder nicht) müssen im Body als JSON-Object angegeben werden, z.B. {"description":"Durchtesten2","title":"WebEng","date":"2015-05-20T22:00:00.000Z","done":false,"category":"Uni"}. Die geänderte ToDo-Note wird zurückgegeben. Wenn ein benötigter Wert nicht angegeben wird, dann wird er mit Null überschrieben.


Client:

Single-Page-Anwendung unter Benutzung von AngularJS. Die Daten werden über die RESTful API des node.js-Server geladen und geändert und dann angezeigt.