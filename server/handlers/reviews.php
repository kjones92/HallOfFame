<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        $read = "SELECT id, title, description, score, date, review_status_id, album_id, user_id
        FROM review
         order by review.id asc;";
        
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

    function handleGetSingle($reviewId) {

        include ("./utils/dbconn.php");

        $read = "SELECT id, title, description, score, date, review_status_id, album_id, user_id
        FROM review
                where review.id = ?;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $reviewId);

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

        if ((!isset($requestVariables['title'])) || (!isset($requestVariables['description'])) || (!isset($requestVariables['score'])) || (!isset($requestVariables['date']))
        || (!isset($requestVariables['review_status_id'])) || (!isset($requestVariables['album_id'])) || (!isset($requestVariables['user_id'])) ) {
            header("HTTP/1.1 400 Bad Request");
            echo "Review information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $title = $conn->real_escape_string($requestVariables['title']);
            $description = $conn->real_escape_string($requestVariables['description']);
            $score = $conn->real_escape_string($requestVariables['score']);
            $date = $conn->real_escape_string($requestVariables['date']);
            $reviewStatusId = $conn->real_escape_string($requestVariables['review_status_id']);
            $albumId = $conn->real_escape_string($requestVariables['album_id']);
            $user_Id = $conn->real_escape_string($requestVariables['user_id']);

            $query = $conn->prepare("INSERT INTO review (title, description, score, date, review_status_id, album_id, user_id ) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $query->bind_param('ssisiii', $title, $description, $score, $date, $reviewStatusId, $albumId, $user_Id);

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

        if ((!isset($requestVariables['title'])) || (!isset($requestVariables['description'])) || (!isset($requestVariables['score'])) || (!isset($requestVariables['date']))
        || (!isset($requestVariables['review_status_id'])) || (!isset($requestVariables['album_id'])) || (!isset($requestVariables['user_id'])) ) {
            header("HTTP/1.1 400 Bad Request");
            echo "Profile information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $title = $conn->real_escape_string($requestVariables['title']);
            $description = $conn->real_escape_string($requestVariables['description']);
            $score = $conn->real_escape_string($requestVariables['score']);
            $date = $conn->real_escape_string($requestVariables['date']);
            $reviewStatusId = $conn->real_escape_string($requestVariables['review_status_id']);
            $albumId = $conn->real_escape_string($requestVariables['album_id']);
            $user_Id = $conn->real_escape_string($requestVariables['user_id']);

            $query = $conn->prepare("UPDATE review set title = ?, description = ?, score = ?, date = ?, review_status_id = ?, album_id = ?, user_id = ? where id = ?");
            $query->bind_param('ssisiiii', $title, $description, $score, $date, $reviewStatusId, $albumId, $user_Id, $reviewId);

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

    function retrieveReviewId($routing) {
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

    function handleDelete($reviewId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM review WHERE review.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $reviewId);

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
                $reviewId = retrieveReviewId($routing);
                if ($reviewId != null) {
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
                $reviewId = retrieveReviewId($routing);
                $requestVariables = decodeJson();
                if ($reviewId != null) {
                    handlePut($reviewId, $requestVariables);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
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
?>

