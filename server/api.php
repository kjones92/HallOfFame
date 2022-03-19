<?php
  $handleRoute = true;
  include("./utils/jwt.php");

  header("Content-Type: application/json");
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: *");

  header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');


  $pathInfo = @$_SERVER['PATH_INFO'] ? @$_SERVER['PATH_INFO'] : "";
  $routing = explode("/", $pathInfo);

  if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    header("HTTP/1.1 200 Ok");
  } else if (count($routing) > 1) {
    $requiresAuth = true;
    $route = $routing[1];
    switch (strtolower($route)) {
      case 'artists':
        include("./handlers/artists.php");
        break;
      case 'albums':
        if (count($routing) >= 4 && strtolower($routing[3]) == "reviews") {
          include("./handlers/reviews.php");
          break;
        }
        if ($_SERVER['REQUEST_METHOD'] == "GET") {
          $requiresAuth = false;
        }
        include("./handlers/albums.php");
        break;
      case 'users':
        if (count($routing) >= 3 && strtolower($routing[2]) == "albums") {
          include("./handlers/userAlbums.php");
          break;
        }
        if (count($routing) >= 3 && strtolower($routing[2]) == "register" && $_SERVER['REQUEST_METHOD'] == "POST") {
          $requiresAuth = false;
        }
        include("./handlers/users.php");
        break;
      case 'reviews':
        if (count($routing) >= 3 && strtolower($routing[2]) == "statuses") {
          include("./handlers/reviewStatuses.php");
          break;
        }
        include("./handlers/reviews.php");
        break;
      case 'genres':
        include("./handlers/genres.php");
        break;
      case 'subgenres':
        include("./handlers/subgenres.php");
        break;
      case 'login':
        include("./handlers/login.php");
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
      } else {
        handle($routing);
      }
    }
  } else {
    header("HTTP/1.1 404 Not Found");
  }
?>