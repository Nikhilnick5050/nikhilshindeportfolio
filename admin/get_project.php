<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

if (isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $project = $stmt->fetch();
    
    if ($project) {
        header('Content-Type: application/json');
        echo json_encode($project);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Project not found']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Project ID required']);
}
?>
