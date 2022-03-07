<?php

include ("./utils/dbconn.php"); 

$read = "SELECT email, password, role_id
        FROM user;";

$result = $conn->query($read);

if (($_SERVER['PHP_AUTH_USER'] == "Admin" ) && ($_SERVER['PHP_AUTH_PW'] = "password")) {
    echo "valid username and password"; 
} else {
    header("WWW-Authenticate: Basic realm='Admin Dashboard'");
    header("HTTP/1.0 401 Unauthorized");
    echo "You need to enter a valid username and password.";
    exit;

    if ($result.str_contains("role_id", 1)) {
        
    }
}

?> 


<?php
    function handleGet() {

        include ("./utils/dbconn.php"); 

        $read = "SELECT email, password, role_id
        FROM user;";
        
        $result = $conn->query($read);
        
        if (!$result)  {
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

        if ((!isset($requestVariables['email'])) || (!isset($requestVariables['password'])) 
        || (!isset($requestVariables['role_id']) )) {
            header("HTTP/1.1 400 Bad Request");
            echo "Login information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $email = $conn->real_escape_string($requestVariables['email']);
            $password = $conn->real_escape_string($requestVariables['password']);
            $roleId = $conn->real_escape_string($requestVariables['role_id']);

            $query = $conn->prepare("INSERT INTO user (email, password, role_id) VALUES (?, ?, ?)");
            $query->bind_param('ssi', $email, $password, $roleId);

            $result = $query->execute();
            
            if (!$result) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            }
            else {
                header("HTTP/1.1 201 Created");
            }
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
