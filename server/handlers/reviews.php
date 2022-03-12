<?php
    function handleGet($albumId) {

        include ("./utils/dbconn.php");

        $read = "SELECT r.id, r.title, r.description, r.score, r.date, r.review_status_id, r.user_id, u.username
            FROM review r
            INNER JOIN user u on r.user_id = u.id
            WHERE r.album_id = ?
            order by date desc;";
        
        $query = $conn->prepare($read);
        $query->bind_param("i", $albumId);

        $query->execute();
        $result = $query->get_result();

        if (!$result) { 
            echo $conn -> error; 
        }

        $api_response = array();
        
        while ($row = $result->fetch_assoc()) {
            
            array_push($api_response, $row);
        }

        if (count($api_response) != 0) {
            $response = json_encode($api_response);
            header("HTTP/1.1 200 OK");
            echo $response;
        }
        else {
            header("HTTP/1.1 204 No Content");
        }
    }

    function handleGetSingle($albumId, $reviewId) {

        include ("./utils/dbconn.php");

        $read = "SELECT r.id, r.title, r.description, r.score, r.date, r.review_status_id, r.user_id, u.username
            FROM review r
            INNER JOIN user u on r.user_id = u.id
            WHERE r.album_id = ? and r.id = ?
            order by date desc;";
        

        $query = $conn->prepare($read);
        $query->bind_param("ii", $albumId, $reviewId);

        $query->execute();
        $result = $query->get_result();
    
        if (!$result) {
            echo $conn -> error;
        }
        else {
            $row = $result->fetch_assoc();

            if ($row != null) {

                $response = json_encode($row);
                
                header("HTTP/1.1 200 OK");
                echo $response;
            }
            else {
                header("HTTP/1.1 204 No Content");
            }
        }
    }


    function handlePost ($albumId, $requestVariables) {
        if ((!isset($requestVariables['title'])) || (!isset($requestVariables['description'])) || (!isset($requestVariables['score']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Review information is required";  
        }
        else {
            include ("./utils/dbconn.php");

            $headers = apache_request_headers();
            $userId = extractUserId(getBearerToken($headers["Authorization"]));
            $title = $conn->real_escape_string($requestVariables['title']);
            $description = $conn->real_escape_string($requestVariables['description']);
            $score = $conn->real_escape_string($requestVariables['score']);

            $query = $conn->prepare("INSERT INTO review (title, description, score, date, review_status_id, album_id, user_id ) VALUES (?, ?, ?, NOW(), 1, ?, ?)");
            $query->bind_param('ssiii', $title, $description, $score, $albumId, $userId);

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

    function handlePut ($reviewId, $requestVariables) {

        if (!isset($requestVariables['review_status_id'])) {
            header("HTTP/1.1 400 Bad Request");
            echo "Profile information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $reviewStatusId = $conn->real_escape_string($requestVariables['review_status_id']);
            $headers = apache_request_headers();
            $userId = extractUserId(getBearerToken($headers["Authorization"]));
            $read = "SELECT u.role_id FROM user u WHERE u.id = ?;";

            $query = $conn->prepare($read);
            $query->bind_param("i", $userId);

            $query->execute();
            $result = $query->get_result();
            $user = $result->fetch_assoc();

            $user = (array)$user;
            if ($user['role_id'] != 1) {
                header("HTTP/1.1 403 Forbidden");
                echo "Admin Access Required";
            }
            else {
                $query = $conn->prepare("UPDATE review set review_status_id = ? where id = ?");
                $query->bind_param('ii', $reviewStatusId, $reviewId);
    
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
    }

    function handleDelete($reviewId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM review WHERE review.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $reviewId);

        if ( $query->execute()) { 
            header("HTTP/1.1 204 OK");
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo $conn -> error;
        }
    }

    function retrieveAlbumId($routing) {
        if (count($routing) >= 3 && ctype_digit($routing[2])) {
            return intval($routing[2]);
        }
        else {
            return null;
        }
    }

    function retrieveReviewId($routing) {
        if (count($routing) >= 5 && ctype_digit($routing[4])) {
            return intval($routing[4]);
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
        if ($albumId != null) {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    $reviewId = retrieveReviewId($routing);
                    if ($reviewId != null) { 
                        handleGetSingle($albumId, $reviewId); 
                    }
                    else { 
                        handleGet($albumId);
                    }
                    break;
                case 'POST':
                  $requestVariables = decodeJson();
                  handlePost($albumId, $requestVariables);
                  break;
                case 'PUT':
                    $reviewId = retrieveReviewId($routing);
                    $requestVariables = decodeJson();
                    if ($reviewId != null) {
                        handlePut($reviewId, $requestVariables);
                    }
                    else {
                        header("HTTP/1.1 400 Bad Request");
                        echo "Id is required to update the album";  
                    }
                    break;
                case 'DELETE':
                    $reviewId = retrieveReviewId($routing);
                    $requestVariables = decodeJson();
                    if ($reviewId != null) {
                        handleDelete($reviewId);
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
        else {
            header("HTTP/1.1 404 Not Found"); 
        }
    }
?>