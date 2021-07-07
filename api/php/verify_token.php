<?php
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_httponly', 0);
    ini_set('session.cookie_secure', 1);
    ini_set('session.cookie_samesite', 'Strict');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    require_once('sql.php');
    $arr = array();
    $statement = 'SELECT `user` FROM `validation` WHERE (`key` IN '.$GET['key'].' AND `id` IN '.$GET['user_id'].')';
    $statement = mysqli_query($obj->conn,$statement);
    while ($row = $statement->fetch_assoc()){
		  $jsonData = '{"results":[';
        $line = new stdClass;
        $line->answer = 'OK';      
        $arr[] = json_encode($line);
        $jsonData .= implode(",", $arr);     
        $jsonData .= ']}';
    }
    echo $jsonData;
?>
