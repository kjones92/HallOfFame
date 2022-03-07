<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        $read = "SELECT * FROM genre;";
        
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

    function handlePost ($requestVariables) {

        // instead of $_POST['username'] it should be $requestVariables['username']
        // instead of isset($_POST['username']) it should be isset("username", $requestVariables)

        if ((!isset($requestVariables['description']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Genre information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $description = $conn->real_escape_string($requestVariables['description']);

            $query = $conn->prepare("INSERT INTO genre (description) VALUES (?)");
            $query->bind_param('s', $description);

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


    function handlePut ($genreId, $requestVariables) {

        if ((!isset($requestVariables['description']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Genre information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $description = $conn->real_escape_string($requestVariables['description']);

            $query = $conn->prepare("UPDATE genre set description = ? where id = ?");
            $query->bind_param('si', $description, $genreId);

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

    function retrieveGenreId($routing) {
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

    function handleDelete($genreId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM genre WHERE genre.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $genreId);

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
              handleGet();
              break;
            case 'POST':
              $requestVariables = decodeJson();
              handlePost($requestVariables);
              break;
            case 'PUT':
                $genreId = retrieveGenreId($routing);
                $requestVariables = decodeJson();
                if ($genreId != null) {
                    handlePut($genreId, $requestVariables);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
                }
              break;
              case 'DELETE':
                $genreId = retrieveGenreId($routing);
                if ($genreId != null) {
                    handleDelete($genreId);
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
