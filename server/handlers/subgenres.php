<?php
    function handleGet() {
        include ("./utils/dbconn.php");

        $read = "SELECT * FROM subgenre;";
        
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
    }


    function handlePost ($requestVariables) {

        if ((!isset($requestVariables['description'])) || (!isset($requestVariables['genre_id']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Subgenre information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $description = $conn->real_escape_string($requestVariables['description']);
            $genreId = $conn->real_escape_string($requestVariables['genre_id']);

            $query = $conn->prepare("INSERT INTO subgenre (description, genre_id) VALUES (?, ?)");
            $query->bind_param('si', $description, $genreId);

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


    function handlePut ($subgenreId, $requestVariables) {

        if ((!isset($requestVariables['description']))|| (!isset($requestVariables['genre_id']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Subgenre information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $description = $conn->real_escape_string($requestVariables['description']);
            $genreId = $conn->real_escape_string($requestVariables['genre_id']);

            $query = $conn->prepare("UPDATE subgenre set description = ?, genre_id = ? where id = ?");
            $query->bind_param('sii', $description, $genreId, $subgenreId);

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

    function handleDelete($subgenreId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM subgenre WHERE subgenre.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $subgenreId);

        if ($query->execute()) {
            header("HTTP/1.1 204 OK");
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo $conn -> error;
        }
    }

    function retrieveSubgenreId($routing) {
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
                $subgenreId = retrieveSubgenreId($routing);
                $requestVariables = decodeJson();
                if ($subgenreId != null) {
                    handlePut($subgenreId, $requestVariables);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
                }
              break;
              case 'DELETE':
                $subgenreId = retrieveSubgenreId($routing);
                if ($subgenreId != null) {
                    handleDelete($subgenreId);
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