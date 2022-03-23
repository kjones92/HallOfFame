<?php
    function handleGet()
    {

        include("./utils/dbconn.php");

        $read = "SELECT * FROM genre order by description asc;";

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
        $conn->close();
    }

    function handlePost($requestVariables)
    {

        if ((!isset($requestVariables['description']) || $requestVariables['description'] == '')) {
            header("HTTP/1.1 400 Bad Request");
            echo "Genre information is required";
        } else {
            include("./utils/dbconn.php");

            $description = $conn->real_escape_string($requestVariables['description']);

            $query = $conn->prepare("INSERT INTO genre (description) VALUES (?)");
            $query->bind_param('s', $description);

            $result = $query->execute();

            if (!$result) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            } else {
                header("HTTP/1.1 201 Created");
            }
            $conn->close();
        }
    }


    function handlePut($genreId, $requestVariables)
    {

        if (!isset($requestVariables['description']) || $requestVariables['description'] == '') {
            header("HTTP/1.1 400 Bad Request");
            echo "Genre information is required";
        } else {
            include("./utils/dbconn.php");

            $description = $conn->real_escape_string($requestVariables['description']);

            $query = $conn->prepare("UPDATE genre set description = ? where id = ?");
            $query->bind_param('si', $description, $genreId);

            $result = $query->execute();

            if (!$result) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            } else {
                header("HTTP/1.1 204 No Content");
            }
            $conn->close();
        }
    }

    function handleDelete($genreId)
    {

        include("./utils/dbconn.php");

        $read = "DELETE FROM genre WHERE genre.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $genreId);

        if ($query->execute()) {
            header("HTTP/1.1 204 OK");
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo $conn->error;
        }
        $conn->close();
    }

    function retrieveGenreId($routing)
    {
        if (count($routing) > 2 && ctype_digit($routing[2])) {
            return intval($routing[2]);
        } else {
            return null;
        }
    }

    function decodeJson()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function handle($routing)
    {
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
                } else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update genre";
                }
                break;
            case 'DELETE':
                $genreId = retrieveGenreId($routing);
                if ($genreId != null) {
                    handleDelete($genreId);
                } else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update genre";
                }
                break;
            default:
                header("HTTP/1.1 404 Not Found");
        }
    }
?>