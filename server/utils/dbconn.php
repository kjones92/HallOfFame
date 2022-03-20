<?php
      // if running locally is needed - 
      // user = user
      // password = password
      // db = greatest_albums
      $host = array_key_exists("HOST", $_ENV) ? $_ENV["HOST"] : "127.0.0.1";
      $user = array_key_exists("USERNAME", $_ENV) ? $_ENV["USERNAME"] : "kjones15"; 
      $password = array_key_exists("PASSWORD", $_ENV) ? $_ENV["PASSWORD"] : "lw0thbd0jJctDKC9";
      $db =  array_key_exists("DB", $_ENV) ? $_ENV["DB"] : "kjones15"; 

      $conn = new mysqli($host, $user, $password, $db);

      if ($conn->connect_error) {

            $check = "Not connected ".$conn->connect_error;

      }
?>