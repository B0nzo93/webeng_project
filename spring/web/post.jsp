<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>WebEngineering 2015 - Blatt 06 - LÃ¶sung via HTTP POST+JSP</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script> <!-- must come before Bootstrap, because Bootstrap's JavaScript requires jQuery -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
</head>
<body>
<div class="container">
  <div class="jumbotron">
    <h3>Web Engineering 2015 JSP W&auml;hrungsrechner</h3>
    <div class="container">
      <form class="form-horizontal" role="form" method="POST">
        <div class="row">
          <div class="form-group col-sm-2">
            <div class="input-group">
              <input type="number" class="form-control" id="value" name="value" value="${from.value}">
            </div><!-- /input-group -->
          </div><!-- /.col-sm-2 -->
          <div class="form-group col-sm-2">
            <div class="input-group">
              <select class="form-control" id="currency" name="currency">
                <option value="1" ${dir=="1"?"selected":""}>EUR > USD</option>
                <option value="2" ${dir=="2"?"selected":""}>USD > EUR</option>
              </select>
            </div><!-- /input-group -->
          </div><!-- /.col-sm-2 -->
          <div class="form-group col-sm-2">
            <div class="input-group">
              <input id="convert" type="submit" class="btn btn-info" value="Umrechnen"/>
            </div><!-- /input-group -->
          </div><!-- /.col-sm-2 -->
        </div><!-- /.row -->
      </form>
    </div><!-- /.container -->
    <% if(request.getAttribute("to")!=null) { %>
    <div id="result">
      Das Ergebnis lautet: ${to.value} ${to.currency}
    </div>
    <% }
      if(request.getAttribute("error")!=null) { %>
    <div class="alert alert-danger" role="alert">
      ${error}
    </div>
    <% } %>
  </div><!-- /.jumbotron -->
</div><!-- /.container -->
</body>
<script>
</script>
</html>