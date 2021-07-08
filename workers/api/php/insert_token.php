<?php
	 //VALUES FOR SECURE REQUESTS
    //ini_set('session.use_strict_mode', 1);
    //ini_set('session.cookie_httponly', 0);
    //ini_set('session.cookie_secure', 1);
    //ini_set('session.cookie_samesite', 'Strict');
    header('Content-Type: application/json; charset=utf-8');
    //header('Access-Control-Allow-Origin: *');
    //header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    //header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    require_once('sql.php');
    $arr = array();
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
    	$key = $_GET['key'];
    	$uid = $_GET['user_id'];
    }
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
    	$key = $_POST['key'];
    	$uid = $_POST['user_id'];    	
    }
    $statement = 'INSERT INTO `validation` (`key`, `id`) VALUES ("'.$key.'","'.$uid.'")';
    $statement = mysqli_query($obj->conn,$statement);
    echo json_encode('OK');
?>
