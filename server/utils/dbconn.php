<?php

      $host = array_key_exists("HOST", $_ENV) ? $_ENV["HOST"] : "127.0.0.1";
      $user = "user"; 
      $password = "password"; 
      $db = "greatest_albums"; 

      $conn = new mysqli($host, $user, $password, $db);

      if ($conn->connect_error) {

            $check = "Not connected ".$conn->connect_error;

      }
 ?>