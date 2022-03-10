<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        $read = "SELECT album.*, a.name artist_name, album.ranking, g.description genre, sg.description subgenre FROM album
        left outer join artist_album aa on album.id = aa.album_id
        left outer join artist a on aa.artist_id = a.id

        left outer join album_genre ag on album.id = ag.album_id
        left outer join genre g on ag.genre_id = g.id

        left outer join album_subgenre asg on album.id = asg.album_id
        left outer join subgenre sg on asg.subgenre_id = sg.id";
        
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

    function handleGetSingle($albumId) {

        include ("./utils/dbconn.php");
        //, a.id artist_id, g.id genre_id, sg.id subgenre_id 
        $read = " SELECT album.*, a.name artist_name, a.ranking, g.description genre, sg.description subgenre FROM album
        left outer join artist_album aa on album.id = aa.album_id
        left outer join artist a on aa.artist_id = a.id

        left outer join album_genre ag on album.id = ag.album_id
        left outer join genre g on ag.genre_id = g.id

        left outer join album_subgenre asg on album.id = asg.album_id
        left outer join subgenre sg on asg.subgenre_id = sg.id
        where album.id = ?; ";
        
        $query = $conn->prepare($read);
        $query->bind_param("i", $albumId);

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

        if ((!isset($requestVariables['title'])) || (!isset($requestVariables['year'])) || (!isset($requestVariables['artistId'])) 
        || (!isset($requestVariables['genreId'])) || (!isset($requestVariables['subgenreId'])) || (!isset($requestVariables['rank'])) ) {
            header("HTTP/1.1 400 Bad Request");
            echo "Album information is required";  
        }
        else {
            include ("./utils/dbconn.php");

            $conn->autocommit(false);
            try {

                $title = $conn->real_escape_string($requestVariables['title']);
                $year = $conn->real_escape_string($requestVariables['year']);
                $rank = $conn->real_escape_string($requestVariables['rank']);

                $updateRankQuery = $conn->prepare("UPDATE album set ranking = ranking + 1 where ranking >= ?");
                $updateRankQuery->bind_param('i', $rank);
                $updateRankQuery->execute();

                $albumQuery = $conn->prepare("INSERT INTO album (title, year, ranking) VALUES (?, ?, ?)");
                $albumQuery->bind_param('sii', $title, $year, $rank);
                $albumQuery->execute();

                $newAlbumId = $conn->insert_id; 

                $artistId = $conn->real_escape_string($requestVariables['artistId']);
                $genreId = $conn->real_escape_string($requestVariables['genreId']);
                $subgenreId = $conn->real_escape_string($requestVariables['subgenreId']);

                $artistAssociationQuery = $conn->prepare("INSERT INTO artist_album (artist_id, album_id) VALUES (?, ?)");
                $artistAssociationQuery->bind_param('ii', $artistId, $newAlbumId); 
                $artistAssociationQuery->execute();

                $genreAssociationQuery = $conn->prepare("INSERT INTO album_genre (genre_id, album_id) VALUES (?, ?)");
                $genreAssociationQuery->bind_param('ii', $genreId, $newAlbumId); 
                $genreAssociationQuery->execute();

                $subgenreAssociationQuery = $conn->prepare("INSERT INTO album_subgenre (subgenre_id, album_id) VALUES (?, ?)");
                $subgenreAssociationQuery->bind_param('ii', $subgenreId, $newAlbumId); 
                $subgenreAssociationQuery->execute();

                header("HTTP/1.1 201 Created");

            } catch (Exception $e) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $e->getMessage();  
            }
            finally{
                $conn->autocommit(true);
            }
        }
    }

    function handlePut ($albumId, $requestVariables) {

        if ((!isset($requestVariables['title'])) || (!isset($requestVariables['year'])) || (!isset($requestVariables['artistId']))
         || (!isset($requestVariables['genreId'])) || (!isset($requestVariables['subgenreId'])) || (!isset($requestVariables['rank']))) {
            header("HTTP/1.1 400 Bad Request");
            echo "Profile information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $title = $conn->real_escape_string($requestVariables['title']);
            $year = $conn->real_escape_string($requestVariables['year']);
            $artistId = $conn->real_escape_string($requestVariables['artistId']);
            $genreId = $conn->real_escape_string($requestVariables['genreId']);
            $subgenreId = $conn->real_escape_string($requestVariables['subgenreId']);

            $conn->autocommit(false);
            try {
                $rank = $conn->real_escape_string($requestVariables['rank']);
                $updateRankQuery = $conn->prepare("UPDATE album set ranking = ranking + 1 where ranking >= ?");
                $updateRankQuery->bind_param('i', $rank);
                $updateRankQuery->execute();

                $albumQuery = $conn->prepare("UPDATE album set title = ?, year = ? where id = ?");
                $albumQuery->bind_param('sii', $title, $year, $albumId);

                $artistQuery = $conn->prepare("UPDATE artist_album set artist_id = ? where album_id = ?");
                $artistQuery->bind_param('ii', $artistId, $albumId);

                $genreQuery = $conn->prepare("UPDATE album_genre set genre_id = ? where album_id = ?");
                $genreQuery->bind_param('ii', $genreId, $albumId);

                $subgenreQuery = $conn->prepare("UPDATE album_subgenre set subgenre_id = ? where album_id = ?");
                $subgenreQuery->bind_param('ii', $subgenreId, $albumId);

                $albumQuery->execute();
                $artistQuery->execute();
                $genreQuery->execute();
                $subgenreQuery->execute();

                $conn->autocommit(true);
            
                header("HTTP/1.1 204 No Content");
            } catch (Exception $e) {
                header("HTTP/1.1 500 Internal Server Error");
                echo $e->getMessage();  
            }
        }
    }

    function retrieveAlbumId($routing) {
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

    function handleDelete($albumId) {

        include ("./utils/dbconn.php");

        $read = "DELETE FROM album WHERE album.id = ? ;";

        $query = $conn->prepare($read);
        $query->bind_param("i", $albumId);

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
                $albumId = retrieveAlbumId($routing);
                if ($albumId != null) {
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
                $albumId = retrieveAlbumId($routing);
                $requestVariables = decodeJson();
                if ($albumId != null) {
                    handlePut($albumId, $requestVariables);
                }
                else {
                    header("HTTP/1.1 400 Bad Request");
                    echo "Id is required to update user";  
                }
              break;
              case 'DELETE':
                $albumId = retrieveAlbumId($routing);
                $requestVariables = decodeJson();
                if ($albumId != null) {
                    handleDelete($albumId);
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
