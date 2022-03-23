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
                
                header("HTTP/1.1 200 OK"); 
                echo json_encode(array("access" => generate_jwt($access)));
            }
            $conn->close();
        }
        
    }


    function handlePost ($requestVariables) {
        if ((!isset($requestVariables['email']) || $requestVariables['email'] == '') || (!isset($requestVariables['password']) || $requestVariables['password'] == '')) {
            header("HTTP/1.1 400 Bad Request");
            echo "Login information is required";  
        }
        else {
            include ("./utils/dbconn.php");

            $email = $conn->real_escape_string($requestVariables['email']);
            $query = $conn->prepare("select id, username, email, role_id, password from user where email = ? and is_deleted != 1");
            $query->bind_param('s', $email);
            $query->execute();

            $result = $query->get_result();
            $row = $result->fetch_assoc();

            if (!$row) {
                header("HTTP/1.1 401 Unauthorized");
                echo $conn->error;
            }
            else {
                $password = $conn->real_escape_string($requestVariables['password']);
                $databasePassword = $row["password"];
                if (password_verify($password, $databasePassword)) {
                    // note to self - adjust here for the duration of the tokens
                    $access = array('sub'=>$row["id"],'name'=>$row["username"], 'user_role_id'=>$row["role_id"], 'exp'=>(time() + 1800000));
                    $refresh = array('sub'=>$row["id"], 'exp'=>(time() + 18000000));
                    
                    header("HTTP/1.1 200 OK"); 
                    echo json_encode(array("access" => generate_jwt($access), "refresh" => generate_jwt($refresh, "refreshSecret")));
                }
                else {
                    header("HTTP/1.1 401 Unauthorized");
                    echo $conn->error;
                }
            }
            $conn->close();
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