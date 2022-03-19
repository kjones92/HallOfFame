<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        $read = "SELECT * FROM artist order by name asc;";
        
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

        // instead of $_POST['username'] it should be $requestVariables['username']
        // instead of isset($_POST['username']) it should be isset("username", $requestVariables)

        if (!isset($requestVariables['name']))  {
            header("HTTP/1.1 400 Bad Request");
            echo "Artist information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $name = $conn->real_escape_string($requestVariables['name']);

            $query = $conn->prepare("INSERT INTO artist (name) VALUES (?)");
            $query->bind_param('s', $name);

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


    function handlePut ($artistId, $requestVariables) {

        if (!isset($requestVariables['name'])) {
            header("HTTP/1.1 400 Bad Request");
            echo "Profile information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $name = $conn->real_escape_string($requestVariables['name']);

            $query = $conn->prepare("UPDATE artist set name = ? where id = ?");
            $query->bind_param('si', $name, $artistId);

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

    function handleDelete($artistId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM artist WHERE artist.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $artistId);

        if ( $query->execute()) {
            header("HTTP/1.1 204 OK");
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo $conn -> error;
        }
    }

    function retrieveArtistId($routing) {
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
                $artistId = retrieveArtistId($routing);
                $requestVariables = decodeJson();
                if ($artistId != null) {
                    handlePut($artistId, $requestVariables);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
                }
              break;
              case 'DELETE':
                $artistId = retrieveArtistId($routing);
                $requestVariables = decodeJson();
                if ($artistId != null) {
                    handleDelete($artistId);
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