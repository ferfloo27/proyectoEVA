<?php
include 'config.php';

if (isset($_POST['submit'])) {   
    if (is_uploaded_file($_FILES['fichero']['tmp_name'])) { 
     
        // Creamos las variables para subir a la base de datos
        $ruta = "videos/"; 
        $nombrefinal = trim($_FILES['fichero']['name']); // Eliminamos los espacios en blanco
        $nombrefinal = preg_replace("/\s+/", "", $nombrefinal); // Sustituye una expresión regular para eliminar espacios
        $upload = $ruta . $nombrefinal;  

        if (move_uploaded_file($_FILES['fichero']['tmp_name'], $upload)) { // Movemos el archivo a su ubicación 
            echo "<b>Upload exitoso!. Datos:</b><br>";  
            echo "Nombre: <i><a href=\"".$ruta . $nombrefinal."\">".$_FILES['fichero']['name']."</a></i><br>";  
            echo "Tipo MIME: <i>".$_FILES['fichero']['type']."</i><br>";  
            echo "Peso: <i>".$_FILES['fichero']['size']." bytes</i><br>";  
            echo "<br><hr><br>";  

            $nombre = $_POST["nombre"]; 
            $description = $_POST["description"]; 

            // Preparar la declaración SQL
            $stmt = $conexion->prepare("INSERT INTO videos (nombre, descripcion, url, tipo, size) VALUES (?, ?, ?, ?, ?)");

            if ($stmt) {
                // Vincular parámetros
                $stmt->bind_param("ssssi", $nombre, $description, $nombrefinal, $_FILES['fichero']['type'], $_FILES['fichero']['size']);
                
                // Ejecutar la declaración
                if ($stmt->execute()) {
                    echo "El archivo '".$nombre."' se ha subido con éxito <br>";
                } else {
                    echo "Error al subir el archivo: " . $stmt->error;
                }

                // Cerrar la declaración
                $stmt->close();
            } else {
                echo "Error al preparar la consulta: " . $conexion->error;
            }
        }  
    }  
} 
?> 

<body> 
<form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post" enctype="multipart/form-data">  
    Seleccione archivo: <input name="fichero" type="file" size="150" maxlength="150">  
    <br><br> Nombre: <input name="nombre" type="text" size="70" maxlength="70"> 
    <br><br> Descripcion: <input name="description" type="text" size="100" maxlength="250"> 
    <br><br> 
    <input name="submit" type="submit" value="SUBIR ARCHIVO">   
</form>  
</body>
