<?php include("includes/db_conn.php"); ?>
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

  $newtitle = $_REQUEST['title'];
  $newYear = $_REQUEST['year'];

  $sql = "INSERT INTO album(title, year)  VALUES ('$newtitle', '$newYear')";
  mysqli_query($dbConn, $sql);
}
?>
<!DOCTYPE html>

<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hall of Fame</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css">
</head>

<body>

  <div class="container">
    <h1 class="title">
      <?php
      if ($dbCheck == false) {
        echo "Cannot connect to database";
      }
      ?>
    </h1>

    <?php include("includes/nav.php"); ?>
    <?php

    $result = $dbConn->query("SELECT * FROM album");

    if (!$result) {
      echo $dbConn->error;
    }

    while ($row = $result->fetch_assoc()) {

      $titledata = $row['title'];
      $yeardata = $row['year'];

      echo "<p> Title is: $titledata on year: $yeardata</p>";
    }

    ?>

    

    <form action=index.php method="POST">
      <p>
        <label for="title">Title:</label>
        <input type="text" name="title" id="title">
      </p>
      <p>
        <label for="year">Year:</label>
        <input type="text" name="year" id="year">
      </p>
      <input type="submit" value="Submit">
    </form>

  </div>

</body>

</html>