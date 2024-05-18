<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ejemplo</title>
    <!-- <link rel="stylesheet" href="styles.css"> -->
</head>
<body>
<?php
require ("config.php");
$conexion=mysqli_connect($host,$dbuser, $dbpwd, $db );
if(mysqli_connect_errno()){
    echo "Fallo al conectar con la base de datos";
    exit();
}
mysqli_set_charset($conexion,"utf8");
$consulta="SELECT * FROM videos WHERE id='10'";
$resultados=mysqli_query($conexion,$consulta);
if (!$resultados) {
    die("Error al realizar la consulta: " . mysqli_error($conexion));
}
if(mysqli_num_rows($resultados) == 0) {
    echo "No se encontraron resultados.";
} else {
    while($fila=mysqli_fetch_array($resultados))
    {
        $nombre=$fila['nombre'];
        $descripcion= isset($fila['descripcion']) ? $fila['descripcion'] : ""; // Verificar si 'descripcion' está definida
        $url=$fila['url'];

        echo "<h1>$nombre</h1>";
        echo "<p>$descripcion</p>";
        echo "<video src='$url' controls='controls' width='450' height='450'></video>";
    }
}
mysqli_close($conexion);
?>
</body>
</html>
