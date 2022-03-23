<?php
    function handleGetSingle($albumId)
    {

        include("./utils/dbconn.php");

        $headers = apache_request_headers();
        $userId = extractUserId(getBearerToken($headers["Authorization"]));

        $read = "select is_favourite, is_owned from user_album
                where user_id = ? and album_id = ?;";

        $query = $conn->prepare($read);
        $query->bind_param("ii", $userId, $albumId);

        $query->execute();
        $result = $query->get_result();

        if (!$result) {
            echo $conn->error;
        }

        $row = $result->fetch_assoc();

        if ($row) {
            $response = json_encode($row);

            header("HTTP/1.1 200 OK");
            echo $response;
        } else {
            $userAlbum = array('is_favourite' => 0, 'is_owned' => 0);
            header("HTTP/1.1 200 OK");
            echo json_encode($userAlbum);
        }
        $conn->close();
    }


    function handleGet()
    {

        include("./utils/dbconn.php");

        $headers = apache_request_headers();
        $userId = extractUserId(getBearerToken($headers["Authorization"]));
        $owned = (isset($_GET["owned"]) && trim($_GET["owned"]) == 'true') ? 1 : 0;
        $favourite = (isset($_GET["favourite"]) && trim($_GET["favourite"]) == 'true') ? 1 : 0;

        $read = "SELECT alb.id album_id, alb.title album, a.name artist, alb.year, alb.ranking, ua.is_favourite, ua.is_owned,
            GROUP_CONCAT(DISTINCT g.description SEPARATOR ', ') genre, GROUP_CONCAT(DISTINCT sg.description SEPARATOR ', ') subgenre
        FROM album alb
        left outer join artist_album aa on alb.id = aa.album_id
        left outer join artist a on aa.artist_id = a.id

        left outer join album_genre ag on alb.id = ag.album_id
        left outer join genre g on ag.genre_id = g.id

        left outer join album_subgenre asg on alb.id = asg.album_id
        left outer join subgenre sg on asg.subgenre_id = sg.id

        inner join user_album ua on alb.id = ua.album_id and ua.user_id = ?
        where ua.is_owned = ? or ua.is_favourite = ?
        group by alb.id, alb.title, a.name, alb.year, alb.ranking, ua.is_favourite, ua.is_owned
        order by ranking asc;";

        $query = $conn->prepare($read);
        $query->bind_param("iii", $userId, $owned, $favourite);


        $query->execute();
        $result = $query->get_result();

        if (!$result) {
            echo $conn->error;
        }

        $api_response = array();

        while ($row = $result->fetch_assoc()) {

            array_push($api_response, $row);
        }

        if (count($api_response) != 0) {
            $response = json_encode($api_response);
            header("HTTP/1.1 200 OK");
            echo $response;
        } else {
            header("HTTP/1.1 204 No Content");
        }
        $conn->close();
    }



    function handlePut($albumId, $requestVariables)
    {

        if ((!isset($requestVariables['is_favourite']) || $requestVariables['is_favourite'] == '') || (!isset($requestVariables['is_owned']) || $requestVariables['is_owned'] == '')) {
            header("HTTP/1.1 400 Bad Request");
            echo "User Album association information is required";
        } else {
            include("./utils/dbconn.php");

            $deleteExisting = "delete from user_album where user_id = ? and album_id = ?";
            $headers = apache_request_headers();
            $userId = extractUserId(getBearerToken($headers["Authorization"]));

            $query = $conn->prepare($deleteExisting);
            $query->bind_param("ii", $userId, $albumId);
            if ($query->execute()) {
                $isOwned = $conn->real_escape_string($requestVariables['is_owned']);
                $isFavourite = $conn->real_escape_string($requestVariables['is_favourite']);

                if ($isOwned != "0" || $isFavourite != "0") {
                    $addUserAlbum = $conn->prepare("INSERT INTO user_album (is_owned, is_favourite, user_id, album_id) VALUES (?, ?, ?, ?)");
                    $addUserAlbum->bind_param('iiii',  $isOwned, $isFavourite, $userId, $albumId);

                    if (!$addUserAlbum->execute()) {
                        header("HTTP/1.1 500 Internal Server Error");
                        echo $conn->error;
                    } else {
                        header("HTTP/1.1 201 Created");
                    }
                } else {
                    header("HTTP/1.1 201 Created");
                }
            } else {
                header("HTTP/1.1 500 Internal Server Error");
                echo $conn->error;
            }
            $conn->close();
        }
    }


    function retrieveAlbumId($routing)
    {
        if (count($routing) >= 4 && ctype_digit($routing[3])) {
            return intval($routing[3]);
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
        $albumId = retrieveAlbumId($routing);
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                if ($albumId != null) {
                    handleGetSingle($albumId);
                } else {
                    handleGet();
                }
                break;
            case 'PUT':
                $requestVariables = decodeJson();
                handlePut($albumId, $requestVariables);
                break;
            default:
                header("HTTP/1.1 404 Not Found");
        }
    }
?>