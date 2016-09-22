<?php
if(session_status()===PHP_SESSION_NONE){session_start();}

include_once("dbInfo.php");

$_SESSION['score'] += intval($_POST['amount']);

$con = mysqli_connect(HOST, USERNAME, PASSWORD, DATABASE);
if(mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if($_SESSION['nameHasRecord']) {
    $query = "SELECT score FROM users WHERE name='".$_SESSION['name']."'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    if($row['score'] <= $_SESSION['score']) {
        $_SESSION['nameHasRecord'] = false;
    }
}

if(!$_SESSION['nameHasRecord']) {
    $query = "UPDATE users SET score=".$_SESSION['score']." WHERE name='".$_SESSION['name']."'";
    mysqli_query($con, $query);
}

mysqli_close($con);

echo $_SESSION['score'];
?>