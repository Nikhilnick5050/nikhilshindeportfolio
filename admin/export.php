<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

// Get all projects and testimonials
$projects = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC")->fetchAll();
$testimonials = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll();

// Create export data
$exportData = [
    'projects' => $projects,
    'testimonials' => $testimonials,
    'export_date' => date('Y-m-d H:i:s'),
    'total_projects' => count($projects),
    'total_testimonials' => count($testimonials)
];

// Set headers for download
header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="portfolio_data_' . date('Y_m_d_H_i_s') . '.json"');

// Output the data
echo json_encode($exportData, JSON_PRETTY_PRINT);
exit();
?>
