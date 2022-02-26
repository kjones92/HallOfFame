<?php
  $handleRoute = true;
  
  header("Content-Type: application/json");


  $pathInfo = @$_SERVER['PATH_INFO'] ? @$_SERVER['PATH_INFO'] : "";

  $routing = explode("/", $pathInfo);

  if (count($routing) > 1) {
    $route = $routing[1];

    switch (strtolower($route)) {
      case 'artists':
        include ("./handlers/artists.php");
        break;
      case 'albums':
        include ("./handlers/albums.php");
        break;
      default:
        header("HTTP/1.1 404 Not Found");
        $handleRoute = false;
        break;
    }

    if ($handleRoute) {
      handle();
    } 
  }
  else {
    header("HTTP/1.1 404 Not Found");
  }
?>