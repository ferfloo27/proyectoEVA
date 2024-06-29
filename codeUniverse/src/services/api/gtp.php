<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Archivo JSON con datos de videos
$dataFile = 'data/videos.json';
// URL de la API de OpenAI
$openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
// Clave API de OpenAI
$openaiApiKey = 'AQUI LA APIKEY DE GPT';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['idVideo']) || !isset($input['summary'])) {
        echo json_encode(['message' => 'Datos insuficientes']);
        exit();
    }

    $idVideo = $input['idVideo'];
    $summary = $input['summary'];

    if (file_exists($dataFile)) {
        $data = json_decode(file_get_contents($dataFile), true);

        foreach ($data as $video) {
            if ($video['idVideo'] == $idVideo) {
                $words = $video['words'] ?? [];

                // Obtener evaluación desde GPT
                $gptEvaluation = getEvaluationFromGPT($summary, $words);

                $feedback = "Tu resumen ha sido evaluado con la siguiente respuesta: $gptEvaluation";

                echo json_encode(['message' => $feedback]);
                exit();
            }
        }

        echo json_encode(['message' => 'Video no encontrado']);
    } else {
        echo json_encode(['message' => 'Archivo no encontrado']);
    }
}

// Función para evaluar el resumen usando GPT
function getEvaluationFromGPT($summary, $keywords) {
    global $openaiApiUrl, $openaiApiKey;

    // Prepara el mensaje para el modelo de chat
    $messages = [
        ['role' => 'system', 'content' => 'Eres un asistente útil que evalúa la calidad de resúmenes en base a palabras clave.'],
        ['role' => 'user', 'content' => "Evalúa el siguiente resumen en base a las palabras clave proporcionadas:\n\nResumen: $summary\n\nPalabras clave: " . implode(', ', $keywords) . "\n\n"]
    ];

    $postData = [
        'model' => 'gpt-3.5-turbo',
        'messages' => $messages,
        'max_tokens' => 150, // Ajusta según tus necesidades
        'temperature' => 0.7
    ];

    $ch = curl_init($openaiApiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: ' . 'Bearer ' . $openaiApiKey
    ]);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        curl_close($ch);
        return 'Error al evaluar el resumen: ' . $error_msg;
    }

    curl_close($ch);
    $result = json_decode($response, true);
    return $result['choices'][0]['message']['content'] ?? $response;
}
?>
