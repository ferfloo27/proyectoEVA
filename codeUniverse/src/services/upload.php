<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {   
    if (is_uploaded_file($_FILES['fichero']['tmp_name'])) { 
        $ruta = "videos/"; 
        $nombrefinal = trim($_FILES['fichero']['name']); 
        $nombrefinal = preg_replace("/\s+/", "", $nombrefinal); 
        $upload = $ruta . $nombrefinal;  

        if (move_uploaded_file($_FILES['fichero']['tmp_name'], $upload)) { 
            $nombre = $_POST["nombre"]; 
            $description = $_POST["description"]; 

            $stmt = $conexion->prepare("INSERT INTO videos (nombre, descripcion, url, tipo, size) VALUES (?, ?, ?, ?, ?)");

            if ($stmt) {
                $stmt->bind_param("ssssi", $nombre, $description, $upload, $_FILES['fichero']['type'], $_FILES['fichero']['size']);
                
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(["message" => "El archivo se ha subido con éxito", "url" => $upload]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error al subir el archivo: " . $stmt->error]);
                }

                $stmt->close();
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Error al preparar la consulta: " . $conexion->error]);
            }
        }  
    }  
} 
?>
