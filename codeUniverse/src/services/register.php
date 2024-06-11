<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$response = array('success' => false);

try {
    // Conexión a la base de datos (asegúrate de usar tus propios datos de conexión)
    $conn = new PDO("mysql:host=localhost;dbname=ejemploeva", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recupera los datos de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'];
    $username = $data['username'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = $data['role'];

    // Verifica si el usuario ya existe
    $stmt = $conn->prepare("SELECT * FROM usuario WHERE nombreusuario = :username OR correoelec = :email");
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $response['message'] = 'El nombre de usuario o correo electrónico ya están en uso.';
    } else {
        // Inserta el nuevo usuario
        $stmt = $conn->prepare("INSERT INTO usuario (nombre, nombreusuario, correoelec, contrasena, rol) VALUES (:name, :username, :email, :password, :role)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $role);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Registro exitoso!';
        } else {
            $response['message'] = 'Error al registrar el usuario.';
        }
    }
} catch (PDOException $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>
