<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$dbuser = "root";
$dbpwd = "";
$db = "ejemploeva";

// Conectar a MySQL
$conexion = mysqli_connect($host, $dbuser, $dbpwd);

// Verificar la conexión
if (!$conexion) {
    die("No se ha conectado a la base de datos: " . mysqli_connect_error());
}

// Seleccionar la base de datos
if (!mysqli_select_db($conexion, $db)) {
    die("Error al seleccionar la base de datos: " . mysqli_error($conexion));
}
?>
