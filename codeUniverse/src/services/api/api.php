<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT,PATCH');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$dataFile = 'data/usuarios.json';

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

function handleGet()
{
  global $dataFile;

  if (file_exists($dataFile)) {
    $data = json_decode(file_get_contents($dataFile), true);
    echo json_encode($data);
  } else {
    echo json_encode(['message' => 'Archivo no encontrado']);
  }
}

function handlePost()
{
  global $dataFile;
  $data = json_decode(file_get_contents($dataFile), true);
  $inputData = json_decode(file_get_contents('php://input'), true);

  if (isset($inputData['name'])) {
    // Registro de usuario
    registerUser($data, $inputData);
  } elseif (isset($inputData['username']) && isset($inputData['password'])) {
    // Inicio de sesión
    loginUser($data, $inputData);
  } else {
    echo json_encode(['message' => 'Datos inválidos para POST']);
  }
}

function registerUser(&$data, $inputData)
{
  global $dataFile;

  // Generar un nuevo ID
  $newId = end($data)['id'] + 1;

  // Verificar si el correo o nombre de usuario ya existen
  foreach ($data as $user) {
    if ($user['correoelec'] === $inputData['email'] || $user['nombreusuario'] === $inputData['username']) {
      echo json_encode(['message' => 'Correo electrónico o nombre de usuario ya están en uso.']);
      return;
    }
  }

  $newUser = [
    'id' => $newId,
    'nombre' => $inputData['name'],
    'correoelec' => $inputData['email'],
    'nombreusuario' => $inputData['username'],
    'contrasena' => password_hash($inputData['password'], PASSWORD_DEFAULT), // Hashea la contraseña
    'rol' => $inputData['role'],
    'notificaciones' => [],
    'videosSubidos' => [],
    'videosInscritos' => []
  ];

  $data[] = $newUser;
  file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

  echo json_encode(['message' => 'Usuario registrado', 'user' => $newUser], JSON_UNESCAPED_UNICODE);
}

function loginUser($data, $inputData)
{
  foreach ($data as $user) {
    if ($user['nombreusuario'] === $inputData['username']) {
      if (password_verify($inputData['password'], $user['contrasena'])) {
        //unset($user['contrasena']); // Eliminar la contraseña de los datos del usuario
        echo json_encode(['message' => 'Inicio de sesión exitoso', 'user' => $user]);
        return;
      }
    }
  }
  echo json_encode(['message' => 'Nombre de usuario o contraseña incorrectos']);
}


function handlePut()
{
  global $dataFile;
  $data = json_decode(file_get_contents($dataFile), true);
  $inputData = json_decode(file_get_contents('php://input'), true);

  foreach ($data as &$user) {
    if ($user['id'] === $inputData['id']) {
      $user = $inputData; // Sobrescribimos el usuario completo
      break;
    }
  }

  file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
  echo json_encode(['message' => 'Usuario actualizado', 'user' => $inputData]);
}

function handlePatch()
{
    global $dataFile;
    $data = json_decode(file_get_contents($dataFile), true);
    $inputData = json_decode(file_get_contents('php://input'), true);

    if (isset($inputData['userId']) && isset($inputData['idVideo']) && isset($inputData['autorId'])) {
        // Actualizar videosSubidos
        actualizarVideosSubidos($inputData);
    } else {
        echo json_encode(['message' => 'Datos insuficientes para la operación']);
    }

    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

function actualizarVideosSubidos($inputData)
{
    global $dataFile;
    $data = json_decode(file_get_contents($dataFile), true);

    $autorId = $inputData['autorId'];
    $idVideo = $inputData['idVideo'];
    $userId = $inputData['userId'];

    foreach ($data as &$user) {
        if ($user['id'] == $autorId) {
            $videoFound = false;
            foreach ($user['videosSubidos'] as &$video) {
                if ($video['idVideo'] == $idVideo) {
                    // Si el video ya está, agregar el userId si no está ya inscrito
                    if (!in_array($userId, $video['inscritos'])) {
                        $video['inscritos'][] = $userId;
                    }
                    $videoFound = true;
                    break;
                }
            }
            // Si el video no está en la lista, agregar nuevo objeto
            if (!$videoFound) {
                $user['videosSubidos'][] = [
                    'idVideo' => $idVideo,
                    'inscritos' => [$userId]
                ];
            }
            break;
        }
    }

    echo json_encode(['message' => 'videosSubidos actualizado', 'user' => $user]);
}

?>