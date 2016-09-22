<?php
if(session_status()===PHP_SESSION_NONE){session_start();}

include_once("dbInfo.php");

$con = mysqli_connect(HOST, USERNAME, PASSWORD, DATABASE);
if(mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$query = "SELECT * FROM users";
$result = mysqli_query($con, $query);
$rank = [];
$i=0;
while($row = mysqli_fetch_array($result)) {
    if($row['name']==$_SESSION['name'])
        $rank[$i]['actualUser'] = true;
    $rank[$i]['name'] = $row['name'];
    $rank[$i]['score'] = $row['score'];
    $i++;
}

usort($rank, function($a, $b) {//sort by score
    return $b['score'] - $a['score'];
});

mysqli_close($con);

echo json_encode($rank);
?>