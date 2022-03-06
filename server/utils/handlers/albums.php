<?php
    function handleGet() {

        include ("./utils/dbconn.php");

        //Mark's code 
       // $read = "SELECT album.*, a.name artist_name FROM album
       // left outer join artist_album aa on album.id = aa.album_id
        //left outer join artist a on aa.artist_id = a.id";

        // Katrina's code to include genre and subgenre - to be reviewed 
        $read = "SELECT album.*, a.name artist_name, g.description genre, sg.description subgenre FROM album
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

    function handlePost () {

        if ((!isset($_POST['title'])) || (!isset($_POST['year'])) || (!isset($_POST['artist_name'])) || (!isset($_POST['genre'])) || (!isset($_POST['subgenre']))) {
            header("HTTP/1.1 400 Bad Request");
            //echo "Title and year are required";  
            echo "Album information is required";  

        }
        else {
            include ("./utils/dbconn.php");

            $albumTitle = $conn->real_escape_string($_POST['title']);
            $albumYear = $conn->real_escape_string($_POST['year']);
            $albumArtist = $conn->real_escape_string($_POST['artist_name']);
            $albumGenre = $conn->real_escape_string($_POST['genre']);
            $albumSubgenre = $conn->real_escape_string($_POST['subgenre']);


            //Mark's original code
            //$insertquery="INSERT INTO album (title, year) VALUES ('$albumTitle', '$albumYear')";
            //$result = $conn->query($insertquery);
            
           // if(!$result) { echo $conn->error; } 
           // header("HTTP/1.1 201 Created");


            //Katrina solution - check if correct 
            $insertAlbum="INSERT INTO album (title, year) VALUES ('$albumTitle', '$albumYear' )";
            $insertArtist="INSERT INTO artist (name) VALUES ('$albumArtist')";
            $insertGenre ="INSERT INTO genre (description) VALUES ('$albumGenre')";
            $insertSubgenre="INSERT INTO subgenre (description) VALUES ('$albumSubgenre')";

            $resultAlbum = $conn->query($insertAlbum);
            $resultArtist = $conn->query($insertArtist);
            $resultGenre = $conn->query($insertGenre);
            $resultSubgenre = $conn->query($insertSubgenre);
            
           if((!$resultAlbum) || (!$resultArtist) || (!$resultGenre) || (!$resultSubgenre)) { echo $conn->error; } 
           header("HTTP/1.1 201 Created");

        }
    }


    function handle() {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
              handleGet();
              break;
            case 'POST':
              handlePost ();
              break;
            default:
            header("HTTP/1.1 404 Not Found"); 
        }
    }
