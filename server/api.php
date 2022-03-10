<?php
  $handleRoute = true;
  include ("./utils/jwt.php");

  header("Content-Type: application/json");


  $pathInfo = @$_SERVER['PATH_INFO'] ? @$_SERVER['PATH_INFO'] : "";

  $routing = explode("/", $pathInfo);

  if (count($routing) > 1) {
    $requiresAuth = true;
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
        $requiresAuth = false;
        break;
      default:
        header("HTTP/1.1 404 Not Found");
        $handleRoute = false;
        break;
    }

    if ($handleRoute) {
      $headers = apache_request_headers();
      if ($requiresAuth && (!array_key_exists('Authorization', $headers) || !is_jwt_valid(getBearerToken($headers["Authorization"])))) {
        header("HTTP/1.1 401 Unauthorized");
      }
      else {
        handle($routing);
      }
    } 
  }
  else {
    header("HTTP/1.1 404 Not Found");
  }
?>