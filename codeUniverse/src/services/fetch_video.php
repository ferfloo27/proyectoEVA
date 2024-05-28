<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$id = $_GET['id'];
$consulta = "SELECT * FROM videos WHERE id=?";
$stmt = $conexion->prepare($consulta);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["message" => "No se encontraron resultados."]);
} else {
    $video = $result->fetch_assoc();
    echo json_encode($video);
}

$stmt->close();
mysqli_close($conexion);
