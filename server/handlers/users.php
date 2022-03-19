<?php
function handleGet()
{
    include("./utils/dbconn.php");

    $read = "SELECT u.id, username, email, r.description user_role
                FROM user u
                inner join role r on u.role_id = r.id where is_deleted != 1 order by u.id asc;";

    $result = $conn->query($read);

    if (!$result) {
        echo $conn->error;
    }

    $api_response = array();

    while ($row = $result->fetch_assoc()) {

        array_push($api_response, $row);
    }

    $response = json_encode($api_response);

    header("HTTP/1.1 200 OK");
    echo $response;
}

function handleGetSingle($userId)
{

    include("./utils/dbconn.php");

    $read = "SELECT u.id, username, email, r.id user_role_id, r.description user_role
                FROM user u
                inner join role r on u.role_id = r.id
                where u.id = ? and u.is_deleted != 1;";

    $query = $conn->prepare($read);
    $query->bind_param("i", $userId);

    $query->execute();
    $result = $query->get_result();

    if (!$result) {
        echo $conn->error;
    }

    $row = $result->fetch_assoc();
    $response = json_encode($row);

    header("HTTP/1.1 200 OK");
    echo $response;
}

function handleRegisterPost($requestVariables)
{
    $requestVariables['user_role_id'] = 2;
    handlePost($requestVariables);
}


function handlePost($requestVariables)
{

    if ((!isset($requestVariables['username'])) || (!isset($requestVariables['email'])) || (!isset($requestVariables['password'])) || (!isset($requestVariables['user_role_id']))) {
        header("HTTP/1.1 400 Bad Request");
        echo "Profile information is required";
    } else {
        include("./utils/dbconn.php");
        $userExists = "SELECT id FROM user u where email = ? and is_deleted != 1;";

        $email = $conn->real_escape_string($requestVariables['email']);
        $userExistsQuery = $conn->prepare($userExists);
        $userExistsQuery->bind_param("s", $email);

        $userExistsQuery->execute();
        $userExists = $userExistsQuery->get_result();
        $row = $userExists->fetch_assoc();

        if (!isset($row["id"])) {
            $name = $conn->real_escape_string($requestVariables['username']);
            $password = $conn->real_escape_string($requestVariables['password']);
            $roleId = $conn->real_escape_string($requestVariables['user_role_id']);
            $encryptedPassword = password_hash($password, PASSWORD_DEFAULT);

            $query = $conn->prepare("INSERT INTO user (username, email, password, role_id) VALUES (?, ?, ?, ?)");
            $query->bind_param('sssi', $name, $email, $encryptedPassword, $roleId);

            $result = $query->execute();

            if (!$result) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            } else {
                header("HTTP/1.1 201 Created");
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            echo "Email already exists";
        }
    }
}


function handlePut($userId, $requestVariables)
{

    if ((!isset($requestVariables['username'])) || (!isset($requestVariables['email'])) || (!isset($requestVariables['user_role_id']))) {
        header("HTTP/1.1 400 Bad Request");
        echo "Profile information is required";
    } else {
        include("./utils/dbconn.php");

        $email = $conn->real_escape_string($requestVariables['email']);
        $userExists = "SELECT id, password FROM user u where id = ? and is_deleted != 1;";

        $userExistsQuery = $conn->prepare($userExists);
        $userExistsQuery->bind_param("i", $userId);

        $userExistsQuery->execute();
        $userExists = $userExistsQuery->get_result();
        $row = $userExists->fetch_assoc();

        if (isset($row["id"])) {
            $name = $conn->real_escape_string($requestVariables['username']);
            $password = $conn->real_escape_string($requestVariables['password']);
            $roleId = $conn->real_escape_string($requestVariables['user_role_id']);
            $encryptedPassword = $row["password"];

            if (isset($requestVariables['password']) && $requestVariables['password'] != "") {
                $encryptedPassword = password_hash($password, PASSWORD_DEFAULT);
            }

            $query = $conn->prepare("UPDATE user set username = ?, email = ?, password = ?, role_id = ? where id = ?");
            $query->bind_param('sssii', $name, $email, $encryptedPassword, $roleId, $userId);

            $result = $query->execute();

            if (!$result) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            } else {
                header("HTTP/1.1 204 No Content");
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            echo "User does not exist";
        }
    }
}

function handleDelete($userId)
{

    include("./utils/dbconn.php");

    $read = "update user set is_deleted = 1 WHERE user.id = ?;";

    $query = $conn->prepare($read);
    $query->bind_param("i", $userId);

    if ($query->execute()) {
        header("HTTP/1.1 204 OK");
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo $conn->error;
    }
}

function retrieveUserId($routing)
{
    if (count($routing) > 2 && ctype_digit($routing[2])) {
        return intval($routing[2]);
    } else {
        return null;
    }
}

function isRegister($routing)
{
    return count($routing) >= 3 && strtolower($routing[2]) == "register";
}

function decodeJson()
{
    return json_decode(file_get_contents('php://input'), true);
}

function handle($routing)
{
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $userId = retrieveUserId($routing);
            if ($userId != null) {
                handleGetSingle(intval($routing[2]));
            } else {
                handleGet();
            }
            break;
        case 'POST':
            $requestVariables = decodeJson();
            if (isRegister($routing)) {
                handleRegisterPost($requestVariables);
            } else {
                handlePost($requestVariables);
            }

            break;
        case 'PUT':
            $userId = retrieveUserId($routing);
            $requestVariables = decodeJson();
            if ($userId != null) {
                handlePut($userId, $requestVariables);
            } else {
                header("HTTP/1.1 400 Bad Request");
                echo "Id is required to update user";
            }
            break;
        case 'DELETE':
            $userId = retrieveUserId($routing);
            $requestVariables = decodeJson();
            if ($userId != null) {
                handleDelete($userId);
            } else {
                header("HTTP/1.1 400 Bad Request");
                echo "Id is required to update user";
            }
            break;
        default:
            header("HTTP/1.1 404 Not Found");
    }
}
