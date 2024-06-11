<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$response = array('success' => false);

try {
    $conn = new PDO("mysql:host=localhost;dbname=ejemploeva", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
     // Verifica si el JSON se ha decodificado correctamente
     if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }

    // Verifica si se proporcionaron username y password
    if (!isset($data['username']) || !isset($data['password'])) {
        throw new Exception('Datos incompletos: username o password faltante.');
    }

    $username = $data['username'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT * FROM usuario WHERE nombreusuario = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($password, $user['password'])) {
            $response['success'] = true;
            unset($user['password']);
            $response['user'] = [
                'username' => $user['username'],
                'rol' => $user['rol'] // Asume que el campo `role` existe en la base de datos
            ];
        } else {
            $response['message'] = 'Contraseña incorrecta.';
        }
    } else {
        $response['message'] = 'Nombre de usuario no encontrado.';
    }
} catch (PDOException $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>
