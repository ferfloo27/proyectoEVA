<?php
include 'config.php';

if (isset($_POST['submit'])) {   
    if (is_uploaded_file($_FILES['fichero']['tmp_name'])) { 
     
        // Definir el directorio de subida
        $ruta = "videos/"; 
        $nombre_archivo = trim($_FILES['fichero']['name']); // Eliminar espacios en blanco
        $nombre_archivo = preg_replace("/\s+/", "", $nombre_archivo); // Eliminar espacios adicionales
        $nombrefinal = $ruta . $nombre_archivo; // Crear el nombre final incluyendo la ruta

        if (move_uploaded_file($_FILES['fichero']['tmp_name'], $nombrefinal)) { // Mover el archivo a su ubicación 
            echo "<b>Upload exitoso!. Datos:</b><br>";  
            echo "Nombre: <i><a href=\"".$nombrefinal."\">".$nombre_archivo."</a></i><br>";  
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
        } else {
            echo "Error al mover el archivo subido.";
        }  
    } else {
        echo "Error en la subida del archivo.";
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
