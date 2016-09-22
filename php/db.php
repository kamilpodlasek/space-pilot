<?php
if(session_status()===PHP_SESSION_NONE){session_start();}

include_once("dbInfo.php");

if(isset($_POST['setUpDb'])) {
    $con = mysqli_connect(HOST, USERNAME, PASSWORD);
    if(mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $query = "CREATE DATABASE ".DATABASE;
    mysqli_query($con, $query);

    $query = "CREATE TABLE IF NOT EXISTS `".DATABASE."`.`users` (
    `name` TINYTEXT CHARACTER SET utf8 COLLATE utf8_polish_ci NOT NULL ,
    `score` SMALLINT UNSIGNED NOT NULL );";
    mysqli_query($con, $query);

    mysqli_close($con);	
}

if(isset($_POST['name'])) {
	$_SESSION['name'] = $_POST['name'];
	$_SESSION['score'] = 0;
	
	$con = mysqli_connect(HOST, USERNAME, PASSWORD, DATABASE);
	if(mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$result = mysqli_query($con, "SELECT name FROM users WHERE name='".$_POST['name']."'");
	if(mysqli_num_rows($result)==0) {//name is not in use
		$_SESSION['nameHasRecord'] = false;
		$query = "INSERT INTO users VALUES ('".$_SESSION['name']."', 0)";
		mysqli_query($con, $query);
	} else {
		$_SESSION['nameHasRecord'] = true;
	}
	
	mysqli_close($con);
}
?>