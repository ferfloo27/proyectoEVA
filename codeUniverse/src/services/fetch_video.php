<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

$consulta = "SELECT * FROM videos";
$resultados = mysqli_query($conexion, $consulta);

if (!$resultados) {
    http_response_code(500);
    echo json_encode(["message" => "Error al realizar la consulta: " . mysqli_error($conexion)]);
} else {
    $videos = [];
    while ($fila = mysqli_fetch_assoc($resultados)) {
        $videos[] = $fila;
    }
    echo json_encode($videos);
}

mysqli_close($conexion);
?>

