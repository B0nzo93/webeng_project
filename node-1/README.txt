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
Das Laden der Daten in das lokale Model verwendet das ngResource Modul, die Verwaltung des Models übernimmt der TodoListController. Dank two-way-databinding kann der View vollständig im HTML Code definiert werden.
Im Menü rechts oben kann die Kategorie ausgewählt werden, die angezeigt werden soll. Alternativ können alle Notizen angezeigt werden ("any"), oder nur die, die keiner Kategorie angehören ("none"). Mit den eingekreisten Plus und Minus Symbolen können Kategorien angelegt und gelöscht werden, der Bleistift ändert den Namen der Kategorie. Mit dem Pfeil nach unten werden alle momentan sichtbaren, als abgeschlossen markierte Notizen gelöscht werden. Das Plus fügt eine neue Notiz hinzu.
Durch klicken auf den Text einer Notiz kann dieser bearbeitet werden, das Verlassen des Eingabefeldes speichert die Änderungen automatisch. Hierbei ist zu beachten, dass die erste Zeile des Textes als Titel interpretiert wird, da so das Wechseln zwischen mehreren Eingabefeldern vermieden wird, wodurch die Usability erhöht wird.
Die Checkbox links von einer Notiz markiert diese als fertig, mit dem Kreuz rechts wird eine Notiz gelöscht. Zudem werden rechts das Erstellungsdatum und, falls vorhanden, die Kategorie angezeit.
Dank CSS 3 Media Queries skaliert die Website automatisch auf mobilen Endgeräten.
Tritt ein Fehler bei der Kommunikation mit dem Server auf, wird eine rote Fehlermeldung unterhalt der Notizliste angezeigt.