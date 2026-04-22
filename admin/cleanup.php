<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

try {
    // Get all image files from uploads directory
    $uploadedFiles = [];
    $projectFiles = glob(UPLOAD_PATH . 'projects/*');
    $testimonialFiles = glob(UPLOAD_PATH . 'testimonials/*');
    
    $uploadedFiles = array_merge($projectFiles, $testimonialFiles);
    
    // Get all image references from database
    $usedFiles = [];
    
    // Get project thumbnails
    $projects = $pdo->query("SELECT thumbnail FROM projects WHERE thumbnail IS NOT NULL AND thumbnail != ''")->fetchAll();
    foreach ($projects as $project) {
        $usedFiles[] = UPLOAD_PATH . $project['thumbnail'];
    }
    
    // Get testimonial images
    $testimonials = $pdo->query("SELECT image FROM testimonials WHERE image IS NOT NULL AND image != ''")->fetchAll();
    foreach ($testimonials as $testimonial) {
        $usedFiles[] = UPLOAD_PATH . $testimonial['image'];
    }
    
    // Find unused files
    $unusedFiles = array_diff($uploadedFiles, $usedFiles);
    
    // Delete unused files
    $deletedCount = 0;
    foreach ($unusedFiles as $file) {
        if (file_exists($file) && is_file($file)) {
            unlink($file);
            $deletedCount++;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => "Cleanup completed. Deleted $deletedCount unused files."
    ]);
    
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Cleanup failed: ' . $e->getMessage()
    ]);
}
?>
