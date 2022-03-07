<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        $read = "SELECT u.id, username, email, password, r.description user_role
                FROM user u
                inner join role r on u.role_id = r.id order by u.id asc;";
        
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

    function handleGetSingle($userId) {

        include ("./utils/dbconn.php");

        $read = "SELECT u.id, username, email, password, r.id user_role_id, r.description user_role
                FROM user u
                inner join role r on u.role_id = r.id
                where u.id = ?;";
        
        $query = $conn->prepare($read);
        $query->bind_param("i", $userId);

        $query->execute();
        $result = $query->get_result();
    
        if (!$result) {
            echo $conn -> error;
        }

        $row = $result->fetch_assoc();

        $response = json_encode($row);

        echo $response;

        header("HTTP/1.1 200 OK");
    }


    function handlePost ($requestVariables) {

        // instead of $_POST['username'] it should be $requestVariables['username']
        // instead of isset($_POST['username']) it should be isset("username", $requestVariables)

        if ((!isset($requestVariables['username'])) || (!isset($requestVariables['email'])) || (!isset($requestVariables['password'])) || (!isset($requestVariables['user_role_id']) )) {
            header("HTTP/1.1 400 Bad Request");
            echo "Profile information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $name = $conn->real_escape_string($requestVariables['username']);
            $email = $conn->real_escape_string($requestVariables['email']);
            $password = $conn->real_escape_string($requestVariables['password']);
            $roleId = $conn->real_escape_string($requestVariables['user_role_id']);

            $query = $conn->prepare("INSERT INTO user (username, email, password, role_id) VALUES (?, ?, ?, ?)");
            $query->bind_param('sssi', $name, $email, $password, $roleId);

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


    function handlePut ($userId, $requestVariables) {

        if ((!isset($requestVariables['username'])) || (!isset($requestVariables['email'])) || (!isset($requestVariables['password'])) || (!isset($requestVariables['user_role_id']) )) {
            header("HTTP/1.1 400 Bad Request");
            echo "Profile information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $name = $conn->real_escape_string($requestVariables['username']);
            $email = $conn->real_escape_string($requestVariables['email']);
            $password = $conn->real_escape_string($requestVariables['password']);
            $roleId = $conn->real_escape_string($requestVariables['user_role_id']);

            $query = $conn->prepare("UPDATE user set username = ?, email = ?, password = ?, role_id = ? where id = ?");
            $query->bind_param('sssii', $name, $email, $password, $roleId, $userId);

            $result = $query->execute();
            
            if (!$result) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            }
            else {
                header("HTTP/1.1 204 No Content");
            }
        }
    }

    function retrieveUserId($routing) {
        if (count($routing) > 2 && ctype_digit($routing[2])) {
            return intval($routing[2]);
        }
        else {
            return null;
        }
    }

    function decodeJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function handleDelete($userId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM user WHERE user.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $userId);

        if ( $query->execute()) {
            return true;
            header("HTTP/1.1 200 OK");
        } else {
            return false;
            echo $conn -> error;
        }
    }


    function handle($routing) {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $userId = retrieveUserId($routing);
                if ($userId != null) {
                    handleGetSingle(intval($routing[2])); 
                }
                else {
                    handleGet();
                }
              break;
            case 'POST':
              $requestVariables = decodeJson();
              handlePost($requestVariables);
              break;
            case 'PUT':
                $userId = retrieveUserId($routing);
                $requestVariables = decodeJson();
                if ($userId != null) {
                    handlePut($userId, $requestVariables);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
                }
              break;
              case 'DELETE':
                $userId = retrieveUserId($routing);
                $requestVariables = decodeJson();
                if ($userId != null) {
                    handleDelete($userId);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
                }
              break;
            default:
            header("HTTP/1.1 404 Not Found"); 
        }
    }
?>

