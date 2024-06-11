<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit();
}

// crear nuevo usuario

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nombre = $_POST['nombre'];
  $correoelec = $_POST['correoelec'];
  $nombreusuario = $_POST['nombreusuario'];
  $contrasena = password_hash($_POST['contrasena'], PASSWORD_BCRYPT);
  $rol = $_POST['rol'];  // 'maestro' o 'estudiante'

  $stmt = $conexion->prepare("INSERT INTO usuario (nombre, correoelec, nombreusuario, contrasena, rol) VALUES (?, ?, ?, ?, ?)");
  if ($stmt) {
    $stmt->bind_param("sssss", $nombre, $correoelec, $nombreusuario, $contrasena, $rol);
    if ($stmt->execute()) {
      http_response_code(201);
      echo json_encode(["message" => "Usuario creado con éxito"]);
    } else {
      http_response_code(500);
      echo json_encode(["message" => "Error al crear el usuario: " . $stmt->error]);
    }
    $stmt->close();
  } else {
    http_response_code(500);
    echo json_encode(["message" => "Error al preparar la consulta: " . $conexion->error]);
  }
}


// recuperar usuario

// if ($_SERVER['REQUEST_METHOD'] === 'GET') {
//   $idusuario = $_GET['idusuario'];

//   $stmt = $conexion->prepare("SELECT idusuario, nombre, correoelec, nombreusuario, rol FROM usuario WHERE idusuario = ?");
//   if ($stmt) {
//     $stmt->bind_param("i", $idusuario);
//     if ($stmt->execute()) {
//       $result = $stmt->get_result();
//       if ($result->num_rows > 0) {
//         $usuario = $result->fetch_assoc();
//         echo json_encode($usuario);
//       } else {
//         http_response_code(404);
//         echo json_encode(["message" => "Usuario no encontrado"]);
//       }
//     } else {
//       http_response_code(500);
//       echo json_encode(["message" => "Error al recuperar el usuario: " . $stmt->error]);
//     }
//     $stmt->close();
//   } else {
//     http_response_code(500);
//     echo json_encode(["message" => "Error al preparar la consulta: " . $conexion->error]);
//   }
// }

// vincular un video a un estudiante
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $idVideo = $_POST['idVideo'];
  $idEstudiante = $_POST['idEstudiante'];

  $stmt = $conexion->prepare("INSERT INTO estudiante_video (idestudiante, idVideo) VALUES (?, ?)");
  if ($stmt) {
      $stmt->bind_param("ii", $idEstudiante, $idVideo);
      if ($stmt->execute()) {
          http_response_code(201);
          echo json_encode(["message" => "Video vinculado al estudiante con éxito"]);
      } else {
          http_response_code(500);
          echo json_encode(["message" => "Error al vincular el video: " . $stmt->error]);
      }
      $stmt->close();
  } else {
      http_response_code(500);
      echo json_encode(["message" => "Error al preparar la consulta: " . $conexion->error]);
  }
}


// agregara nuevos videos solo para maestros
if ($_SERVER['REQUEST_METHOD'] === 'POST') {   
  $idusuario = $_POST['idusuario'];
  
  // Verificar si el usuario es un maestro
  $stmt = $conexion->prepare("SELECT rol FROM usuario WHERE idusuario = ?");
  if ($stmt) {
      $stmt->bind_param("i", $idusuario);
      if ($stmt->execute()) {
          $result = $stmt->get_result();
          if ($result->num_rows > 0) {
              $usuario = $result->fetch_assoc();
              if ($usuario['rol'] !== 'maestro') {
                  http_response_code(403);
                  echo json_encode(["message" => "Solo los maestros pueden crear videos"]);
                  exit();
              }
          } else {
              http_response_code(404);
              echo json_encode(["message" => "Usuario no encontrado"]);
              exit();
          }
      } else {
          http_response_code(500);
          echo json_encode(["message" => "Error al verificar el usuario: " . $stmt->error]);
          exit();
      }
      $stmt->close();
  } else {
      http_response_code(500);
      echo json_encode(["message" => "Error al preparar la consulta: " . $conexion->error]);
      exit();
  }

  if (is_uploaded_file($_FILES['fichero']['tmp_name'])) { 
      $ruta = "videos/"; 
      $nombrefinal = trim($_FILES['fichero']['name']); 
      $nombrefinal = preg_replace("/\s+/", "", $nombrefinal); 
      $upload = $ruta . $nombrefinal;  

      if (move_uploaded_file($_FILES['fichero']['tmp_name'], $upload)) { 
          $nombre = $_POST["nombre"]; 
          $description = $_POST["description"]; 

          $stmt = $conexion->prepare("INSERT INTO videos (usuario_idusuario, nombre, descripcion, url, tipo, size) VALUES (?, ?, ?, ?, ?, ?)");

          if ($stmt) {
              $stmt->bind_param("issssi", $idusuario, $nombre, $description, $upload, $_FILES['fichero']['type'], $_FILES['fichero']['size']);
              
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


// recuperar todos los videos 
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