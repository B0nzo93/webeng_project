<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>ToDo Notes</title>
  </head>
  <body>
  <% if (request.getAttribute("note_object") != null) { %>
  Your note ${note_object.text}
  <% } else { %>
    No note submitted yet
  <% }%>
    <form name="note" method="post" action>
        Title: <input type="text" name="title"><br>
        <textarea name="noteText" rows="4" cols="50">This is a note</textarea><br>
        <input type="hidden" name="action" value="createNote">
        <input type="submit" value="create">
    </form>
  </body>
</html>
