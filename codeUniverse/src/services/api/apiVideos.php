<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$dataFile = 'data/videos.json';
$videoDirectory = 'videos/'; // Directorio donde se guardarán los videos
$baseURL = 'http://localhost/api/videos/'; // Base URL para los videos

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost();
        break;
    case 'PUT':
        handlePut();
        break;
    case 'PATCH':
        handlePatch();
        break;
    default:
        echo json_encode(['message' => 'Método no soportado']);
        break;
}

function handleGet() {
  global $dataFile;

  if (file_exists($dataFile)) {
      $data = json_decode(file_get_contents($dataFile), true);

      if (isset($_GET['idVideo'])) {
          $idVideo = $_GET['idVideo'];
          $video = array_filter($data, function($v) use ($idVideo) {
              return $v['idVideo'] == $idVideo;
          });
          if (!empty($video)) {
              echo json_encode(array_values($video)[0]);
          } else {
              echo json_encode(['message' => 'Video no encontrado']);
          }
      } else {
          echo json_encode($data);
      }
  } else {
      echo json_encode(['message' => 'Archivo no encontrado']);
  }
}

function handlePost() {
  global $dataFile, $videoDirectory, $baseURL;
  $data = json_decode(file_get_contents($dataFile), true);

  // Manejo de archivo subido
  if (!empty($_FILES['fichero']['name'])) {
      $fileName = $_FILES['fichero']['name'];
      $fileTmpName = $_FILES['fichero']['tmp_name'];
      $fileSize = $_FILES['fichero']['size'];
      $fileType = pathinfo($fileName, PATHINFO_EXTENSION);
      $fileNewName = uniqid() . '-' . $fileName; // Genera un nombre único para evitar conflictos
      $fileDest = $videoDirectory . $fileNewName;

      // Mover archivo al directorio de destino
      if (move_uploaded_file($fileTmpName, $fileDest)) {
          // Construcción de la URL del video
          $videoURL = $baseURL . $fileNewName;
      } else {
          echo json_encode(['message' => 'Error al mover el archivo']);
          return;
      }
  } else {
      echo json_encode(['message' => 'Archivo no encontrado']);
      return;
  }

  // Manejo de otros datos enviados en el formulario
  $newVideo = [
      'idVideo' => end($data)['idVideo'] + 1,
      'usuario_idusuario' => $_POST['usuario_idusuario'],
      'titulovideo' => $_POST['nombre'],
      'descripcion' => $_POST['description'],
      'size' => formatSizeUnits($fileSize),
      'tipo' => $fileType,
      'url' => $videoURL
  ];

  $data[] = $newVideo;
  file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
  echo json_encode(['message' => 'Video añadido', 'video' => $newVideo], JSON_UNESCAPED_UNICODE);
}

// Función para formatear el tamaño de archivo en una unidad legible
function formatSizeUnits($bytes) {
  if ($bytes >= 1073741824) {
      $size = number_format($bytes / 1073741824, 2) . ' GB';
  } elseif ($bytes >= 1048576) {
      $size = number_format($bytes / 1048576, 2) . ' MB';
  } elseif ($bytes >= 1024) {
      $size = number_format($bytes / 1024, 2) . ' KB';
  } elseif ($bytes > 1) {
      $size = $bytes . ' bytes';
  } elseif ($bytes == 1) {
      $size = $bytes . ' byte';
  } else {
      $size = '0 bytes';
  }
  return $size;
}


function handlePut() {
  global $dataFile;
  $data = json_decode(file_get_contents($dataFile), true);
  $inputData = json_decode(file_get_contents('php://input'), true);

  if (!isset($inputData['idVideo'])) {
      echo json_encode(['message' => 'ID de video no proporcionado']);
      return;
  }

  $videoFound = false;

  foreach ($data as &$video) {
      if ($video['idVideo'] === $inputData['idVideo']) {
          $video = array_merge($video, $inputData);
          $videoFound = true;
          break;
      }
  }

  if ($videoFound) {
      file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
      echo json_encode(['message' => 'Video actualizado', 'video' => $inputData], JSON_UNESCAPED_UNICODE);
  } else {
      echo json_encode(['message' => 'Video no encontrado']);
  }
}

function handlePatch() {
    global $dataFile;
    $data = json_decode(file_get_contents($dataFile), true);
    $inputData = json_decode(file_get_contents('php://input'), true);

    foreach ($data as &$video) {
        if ($video['idVideo'] === $inputData['idVideo']) {
            foreach ($inputData as $key => $value) {
                if ($key !== 'idVideo') {
                    $video[$key] = $value;
                }
            }
            break;
        }
    }

    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['message' => 'Video parcialmente actualizado', 'video' => $inputData]);
}
?>
