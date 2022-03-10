<?php
    function handleGet () {

        $headers = apache_request_headers();
        if ((!array_key_exists('Authorization', $headers) || !is_jwt_valid(getBearerToken($headers["Authorization"]), "refreshSecret"))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Refresh token is required.";
        }
        else {

            include ("./utils/dbconn.php");

            $userId = extractUserId(getBearerToken($headers["Authorization"]), "refreshSecret");
            $query = $conn->prepare("select id, username, email, role_id, password from user where id = ?  and is_deleted != 1");
            $query->bind_param('i',$userId);
            $query->execute();

            $result = $query->get_result();

            if (!$result) {
                header("HTTP/1.1 401 Unauthorized");
                echo $conn->error;
            }
            else {
                $row = $result->fetch_assoc();
                $access = array('sub'=>$row["id"],'name'=>$row["username"], 'user_role_id'=>$row["role_id"], 'exp'=>(time() + 1800));

                echo json_encode(array("access" => generate_jwt($access)));
                header("HTTP/1.1 200 OK"); 
            }
        }
        
    }


    function handlePost ($requestVariables) {
        if ((!isset($requestVariables['email'])) || (!isset($requestVariables['password']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Login information is required";  
        }
        else {
            include ("./utils/dbconn.php");

            $email = $conn->real_escape_string($requestVariables['email']);
            $query = $conn->prepare("select id, username, email, role_id, password from user where email = ?  and is_deleted != 1");
            $query->bind_param('s', $email);
            $query->execute();

            $result = $query->get_result();

            if (!$result) {
                header("HTTP/1.1 401 Unauthorized");
                echo $conn->error;
            }
            else {
                $password = $conn->real_escape_string($requestVariables['password']);
                $row = $result->fetch_assoc();
                $databasePassword = $row["password"];
                if (password_verify($password, $databasePassword)) {
                    $access = array('sub'=>$row["id"],'name'=>$row["username"], 'user_role_id'=>$row["role_id"], 'exp'=>(time() + 1800));
                    $refresh = array('sub'=>$row["id"], 'exp'=>(time() + 18000000));

                    echo json_encode(array("access" => generate_jwt($access), "refresh" => generate_jwt($refresh, "refreshSecret")));
                    header("HTTP/1.1 200 OK"); 
                }
                else {
                    header("HTTP/1.1 401 Unauthorized");
                    echo $conn->error;
                }
            }
        }
           
    }



    function decodeJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function handle() {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'POST':
                $requestVariables = decodeJson();
                handlePost ($requestVariables);
                break;
            case 'GET':
                handleGet ();
                break;
            default:
            header("HTTP/1.1 404 Not Found"); 
        }
    }
?>
