<?php 
//go to MySQL Databases and create a new user with password, then grant privileges
//MUs1cN0nSt0p
class dbConfig {
   public $host;
   public $username;
   public $password;   
   public $dab;
   public $conn;
public function dbConnect() {
    $this->conn = mysqli_connect($this->host,$this->username,$this->password);
    if (!$this->conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $db_selected = mysqli_select_db($this->conn, $this->dab);
}
};
$obj = new dbConfig();
$obj->host = 'localhost';
$obj->username = 'root';
$obj->password = 'lalala';
$obj->dab = 'validation';
$obj->dbConnect();
?>
