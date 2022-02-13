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
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
    $(document).ready(function() {
      $("#addLink").click(function() {
        $("#addnewAlbum").toggle();
      });
    });
  </script>

</head>

<body>


  <div class="container">
    <h1 class="title">Hall Of Fame</h1>
    <!-- <?php include("includes/nav.php"); ?> -->
    <table style="width: 100%;">
      <tr>
        <td>Album</td>
        <td>Artist</td>
        <td>Year</td>
        <td>Genre</td>
        <td>Subgenre</td>
      </tr>
      <?php

      $result = $dbConn->query("
        select a.title album, art.name artist, a.year, g.description genre,  s.description subgenre 
        from album a
        inner join artist_album aa on a.id = aa.album_id
        inner join artist art on aa.artist_id = a.id
        inner join album_genre ag on a.id = ag.album_id
        inner join genre g on ag.genre_id = g.id
        left outer join album_subgenre asg on a.id = asg.album_id
        left outer join subgenre s on asg.subgenre_id = s.genre_id;
      ");

      if (!$result) {
        echo $dbConn->error;
      }

      while ($row = $result->fetch_assoc()) {

        $album = $row['album'];
        $artist = $row['artist'];
        $year = $row['year'];
        $genre = $row['genre'];
        $subgenre = $row['subgenre'];

        echo "<td>$album</td><td>$artist</td><td>$year</td><td>$genre</td><td>$subgenre</td>";
      }

      ?>

    </table>

    <a href="#" id="addLink">Add new Hall of Famer?</a>
    <div id="addnewAlbum" style="display:none;">
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



  </div>

</body>

</html>