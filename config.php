<?php
$host = "localhost";
$dbuser = "root";
$dbpwd = "";
$db = "ejemplo";

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
