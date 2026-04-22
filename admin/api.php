<?php
require_once 'config.php';

header('Content-Type: application/json');

// Restrict CORS to allowed origins
$allowed_origins = ['https://pratikmane.tech', 'http://localhost:3000'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';

// Security: Check if request is from allowed source
$is_allowed = false;

// Check Origin header (for CORS requests)
if (in_array($origin, $allowed_origins)) {
    $is_allowed = true;
    header('Access-Control-Allow-Origin: ' . $origin);
}

// Check Referer header (for same-origin requests)
foreach ($allowed_origins as $allowed) {
    if (strpos($referer, $allowed) === 0) {
        $is_allowed = true;
        break;
    }
}

// Block direct browser access (no referer/origin = direct URL visit)
if (!$is_allowed && empty($origin) && empty($referer)) {
    http_response_code(403);
    echo json_encode(['error' => 'Direct access not allowed']);
    exit;
}

// Set default CORS header if not already set
if (!in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: https://pratikmane.tech');
}

header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $pdo = getDBConnection();

    $endpoint = $_GET['endpoint'] ?? '';

    switch ($endpoint) {
        case 'projects':
            $stmt = $pdo->query("SELECT * FROM projects ORDER BY featured DESC, created_at DESC");
            $projects = $stmt->fetchAll();

            // Convert to frontend format
            $result = [];
            foreach ($projects as $project) {
                $result[] = [
                    'id' => $project['id'],
                    'title' => $project['title'],
                    'description' => $project['description'],
                    'thumbnail' => $project['thumbnail'] ? SITE_URL . '/admin/uploads/' . $project['thumbnail'] : null,
                    'videoUrl' => $project['video_url'],
                    'category' => $project['category'],
                    'technologies' => json_decode($project['technologies'], true) ?: [],
                    'projectUrl' => $project['project_url'],
                    'galleryImages' => json_decode($project['gallery_images'], true) ?: [],
                    'featured' => (bool) $project['featured']
                ];
            }
            echo json_encode($result);
            break;

        case 'testimonials':
            $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 10");
            $testimonials = $stmt->fetchAll();

            // Convert to frontend format
            $result = [];
            foreach ($testimonials as $testimonial) {
                $result[] = [
                    'id' => $testimonial['id'],
                    'name' => $testimonial['name'],
                    'position' => $testimonial['position'],
                    'company' => $testimonial['company'],
                    'testimonial' => $testimonial['testimonial'],
                    'image' => $testimonial['image'] ? SITE_URL . '/admin/uploads/' . $testimonial['image'] : null,
                    'rating' => (int) $testimonial['rating']
                ];
            }
            echo json_encode($result);
            break;

        case 'stats':
            $projectCount = $pdo->query("SELECT COUNT(*) as count FROM projects")->fetch()['count'];
            $testimonialCount = $pdo->query("SELECT COUNT(*) as count FROM testimonials")->fetch()['count'];
            $featuredCount = $pdo->query("SELECT COUNT(*) as count FROM projects WHERE featured = 1")->fetch()['count'];

            echo json_encode([
                'projects' => (int) $projectCount,
                'testimonials' => (int) $testimonialCount,
                'featured_projects' => (int) $featuredCount
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid endpoint']);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>