<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = 'data/videos.json';

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

                $score = evaluateSummary($summary, $words);
                $feedback = "Tu resumen ha sido evaluado con una puntuación de: $score%";

                if ($score < 50) {
                    $feedback .= " Por favor, considera revisar el video y escribir un resumen más detallado.";
                } else {
                    $feedback .= " Buen trabajo! Has capturado los puntos clave del video.";
                }

                echo json_encode(['message' => $feedback]);
                exit();
            }
        }

        echo json_encode(['message' => 'Video no encontrado']);
    } else {
        echo json_encode(['message' => 'Archivo no encontrado']);
    }
}

function evaluateSummary($summary, $expectedKeywords) {
    $summaryLower = strtolower($summary);
    $score = 0;

    foreach ($expectedKeywords as $keyword) {
        if (strpos($summaryLower, strtolower($keyword)) !== false) {
            $score += 1;
        }
    }

    $totalKeywords = count($expectedKeywords);
    $percentage = $totalKeywords > 0 ? ($score / $totalKeywords) * 100 : 0;

    return round($percentage);
}
?>
