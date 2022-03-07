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
      case 'users':
        include ("./handlers/users.php");
        break;
        case 'reviews':
          include ("./handlers/reviews.php");
          break;
          case 'genres':
            include ("./handlers/genres.php");
            break;
            case 'subgenres':
              include ("./handlers/subgenres.php");
              break;
              case 'login':
                include ("./handlers/login.php");
                break;
      default:
        header("HTTP/1.1 404 Not Found");
        $handleRoute = false;
        break;
    }

    if ($handleRoute) {
      handle($routing);
    } 
  }
  else {
    header("HTTP/1.1 404 Not Found");
  }
?>