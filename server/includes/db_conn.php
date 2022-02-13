<?php

$host = "127.0.0.1";
$user = "user";
$pw = "password";
$db = "greatest_albums";

$dbConn = new mysqli($host, $user, $pw, $db);

if ($dbConn->connect_error) {

  $dbCheck = false;
} else {

  $dbCheck = true;
}

?>
