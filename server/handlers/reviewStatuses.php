<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        $read = "SELECT * FROM review_status;";
        
        $result = $conn->query($read);
        
        if (!$result) {
            echo $conn -> error;
        }
        $api_response = array();
        
        while ($row = $result->fetch_assoc()) {
            
            array_push($api_response, $row);
        }
            
        $response = json_encode($api_response);
        
        header("HTTP/1.1 200 OK");
        echo $response;
        $conn->close();
    }


    function handle() {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
              handleGet();
              break;
            default:
            header("HTTP/1.1 404 Not Found"); 
        }
    }
?>