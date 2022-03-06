<?php
        $host = "127.0.0.1";
        $user = "user";
        $pw = "password";
        $db = "greatest_albums";
 
        $conn = new mysqli($host, $user, $pw, $db);
 
        if ($conn->connect_error) {
 
              $check = "Not connected ".$conn->connect_error;
 
        }
 ?>
