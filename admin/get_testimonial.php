<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

if (isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM testimonials WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $testimonial = $stmt->fetch();
    
    if ($testimonial) {
        header('Content-Type: application/json');
        echo json_encode($testimonial);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Testimonial not found']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Testimonial ID required']);
}
?>
