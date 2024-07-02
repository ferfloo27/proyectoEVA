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
$openaiApiKey = 'aqui va la api key';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['idVideo']) || !isset($input['summary']) || !isset($input['cue']) || !isset($input['notes'])) {
      echo json_encode(['message' => 'Datos insuficientes']);
      exit();
  }

    $idVideo = $input['idVideo'];
    $summary = $input['summary'];
    $cue = $input['cue'];
    $notes = $input['notes'];

    if (file_exists($dataFile)) {
        $data = json_decode(file_get_contents($dataFile), true);

        foreach ($data as $video) {
            if ($video['idVideo'] == $idVideo) {
                $words = $video['words'] ?? [];
                $title = $video['tiulovideo'] ?? 'Sin título';

                // Obtener evaluación desde GPT
                $gptEvaluation = getEvaluationFromGPT($summary,$cue,$notes, $words, $title);

                $feedback = "Tu resumen obtuvo la siguiente evaluación: $gptEvaluation";

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
function getEvaluationFromGPT($summary,$cue,$notes, $keywords, $title) {
    global $openaiApiUrl, $openaiApiKey;

    $messages = [
      ['role' => 'system', 'content' => 'Eres un asistente que evalúa la calidad de resúmenes, ideas principales (cue) y notas en base a palabras clave y el título del video, proporcionando observaciones y una calificación de 1 a 100. No menciones las palabras clave explícitamente en la evaluación.'],
      ['role' => 'user', 'content' => "Por favor, evalúa los siguientes aspectos considerando las palabras clave y el título del video proporcionados:\n\nTítulo: $title\n\nResumen: $summary\n\nIdeas Principales (cue): $cue\n\nNotas: $notes\n\nDebes proporcionar:\n1. Una observación general (muy buena, buena, regular, pésima) sobre la calidad del resumen, ideas principales y notas.\n2. Una evaluación detallada sin mencionar directamente las palabras clave.\n3. Una calificación de 1 a 100 en base a la calidad del resumen, ideas principales y notas."]
  ];

    $postData = [
        'model' => 'gpt-3.5-turbo',
        'messages' => $messages,
        'max_tokens' => 150, // Ajusta según tus necesidades
        'temperature' => 0.2
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

    
    $content = $result['choices'][0]['message']['content'] ?? '';
    $evaluation = parseEvaluationResponse($content);

    return json_encode($evaluation);
}

// Función para analizar la respuesta de GPT
function parseEvaluationResponse($response) {
  $evaluation = [
      'observacionGeneral' => '',
      'evaluacionDetallada' => '',
      'puntaje' => 0
  ];

  // Define los patrones para cada sección de la evaluación
  $patterns = [
      'observacionGeneral' => '/Observación general:\s*(.*?)(?:\n|$)/',
      'evaluacionDetallada' => '/Evaluación detallada:\s*(.*?)(?:\n|$)/',
      'puntaje' => '/Calificación:\s*(\d+)/'
  ];

  foreach ($patterns as $key => $pattern) {
      if (preg_match($pattern, $response, $matches)) {
          $evaluation[$key] = trim($matches[1]);
          if ($key === 'puntaje') {
              $evaluation[$key] = (int)$evaluation[$key];
          }
      }
  }

  return $evaluation;
}
?>
