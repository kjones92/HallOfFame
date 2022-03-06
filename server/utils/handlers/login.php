<?php
    function handleGet() {

        include ("./utils/dbconn.php"); 

        // added role_id as well, to determine whether to display hidden functionality or not - not sure if this is correct // 
        //not sure if login needs to be handled a different way

        $read = "SELECT email, password, role_id
        FROM user;";
        
        $result = $conn->query($read);
        
        if (!$result) {
            echo $conn -> error;
        }

        // build a response array
        $api_response = array();
        
        while ($row = $result->fetch_assoc()) {
            
            array_push($api_response, $row);
        }
            
        // encode the response as JSON
        $response = json_encode($api_response);
        
        // echo out the response
        echo $response;

        header("HTTP/1.1 200 OK");
    }

    function handlePost () {

        if (!isset($_POST['name'])) {
            header("HTTP/1.1 400 Bad Request");
            echo "Name is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $artistData = $conn->real_escape_string($_POST['name']);
            $insertquery="INSERT INTO artist (fact) VALUES ('$artistData')";
            $result = $conn->query($insertquery);
            
            if(!$result) { echo $conn->error; } 
            header("HTTP/1.1 201 Created");
        }
    }


    function handle() {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
              handleGet();
              break;
            case 'POST':
              handlePost ();
              break;
            default:
            header("HTTP/1.1 404 Not Found"); 
        }
    }
?>
