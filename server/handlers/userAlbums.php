<?php
    function handleGetSingle($albumId) {

        include ("./utils/dbconn.php");

        $headers = apache_request_headers();
        $userId = extractUserId(getBearerToken($headers["Authorization"]));

        $read = "select is_favourite, is_owned from user_album
            where user_id = ? and album_id = ?;";
        
        $query = $conn->prepare($read);
        $query->bind_param("ii", $userId, $albumId);

        $query->execute();
        $result = $query->get_result();

        if (!$result) { echo $conn -> error; }

        $row = $result->fetch_assoc();

        if ($row) {
            $response = json_encode($row);
        
            header("HTTP/1.1 200 OK");
            echo $response;
        }
        else {
            $userAlbum = array('is_favourite'=>0,'is_owned'=>0);
            header("HTTP/1.1 200 OK"); 
            echo json_encode($userAlbum);
        }
    }


    function handleGet() {

        include ("./utils/dbconn.php");

        $headers = apache_request_headers();
        $userId = extractUserId(getBearerToken($headers["Authorization"]));
        $favourite = (isset($_GET["favourite"]) && trim($_GET["favourite"]) == 'true');
        $owned = (isset($_GET["favourite"]) && trim($_GET["favourite"]) == 'true');
    

        // add a query to get user albums for favourite or owned.
    }



    function handlePut ($albumId, $requestVariables) {

        if ((!isset($requestVariables['is_favourite'])) || (!isset($requestVariables['is_owned']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "User Album association information is required";  
        }
        else {
            include ("./utils/dbconn.php");

            $deleteExisting = "delete from user_album where user_id = ?";
            $headers = apache_request_headers();
            $userId = extractUserId(getBearerToken($headers["Authorization"]));

            $query = $conn->prepare($deleteExisting);
            $query->bind_param("i", $userId);
            if ( $query->execute()) {
                $isOwned = $conn->real_escape_string($requestVariables['is_owned']);
                $isFavourite = $conn->real_escape_string($requestVariables['is_favourite']);
             
                if ($isOwned != "0" || $isFavourite != "0") {
                    $addUserAlbum = $conn->prepare("INSERT INTO user_album (is_owned, is_favourite, user_id, album_id) VALUES (?, ?, ?, ?)");
                    $addUserAlbum->bind_param('iiii',  $isOwned, $isFavourite, $userId, $albumId);
    
                    if (!$addUserAlbum->execute()) {
                        header("HTTP/1.1 500 Internal Server Error");
                        echo $conn->error;
                    }
                    else {
                        header("HTTP/1.1 201 Created");
                    }
                }
                else {
                    header("HTTP/1.1 201 Created");
                }
            } else {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn -> error;
            }
        }
    }


    function retrieveAlbumId($routing) {
        if (count($routing) >= 4 && ctype_digit($routing[3])) {
            return intval($routing[3]);
        }
        else {
            return null;
        }
    }

    function decodeJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function handle($routing) {
        $albumId = retrieveAlbumId($routing);
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
              handleGetSingle($albumId); 
              break;
            case 'PUT':
              $requestVariables = decodeJson();
              handlePut($albumId, $requestVariables);
              break;
            default:
            header("HTTP/1.1 404 Not Found"); 
        }
    }
