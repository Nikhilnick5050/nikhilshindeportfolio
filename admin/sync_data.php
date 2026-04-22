<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

// Get all projects and testimonials from database
$projects = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC")->fetchAll();
$testimonials = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll();

// Convert to TypeScript format
function convertProjectsToTS($projects) {
    $tsProjects = [];
    foreach ($projects as $project) {
        $technologies = json_decode($project['technologies'], true) ?: [];
        $tsProject = [
            'id' => $project['id'],
            'title' => $project['title'],
            'description' => $project['description'],            'thumbnail' => '/projects/placeholder.jpg',
            'videoUrl' => $project['video_url'] ?: null,
            'category' => $project['category'],
            'technologies' => $technologies,
            'projectUrl' => $project['project_url'] ?: null,
            'featured' => (bool)$project['featured']
        ];
        $tsProjects[] = $tsProject;
    }
    return $tsProjects;
}

function convertTestimonialsToTS($testimonials) {
    $tsTestimonials = [];
    foreach ($testimonials as $testimonial) {
        $tsTestimonial = [
            'id' => $testimonial['id'],
            'name' => $testimonial['name'],
            'position' => $testimonial['position'],
            'company' => $testimonial['company'],
            'testimonial' => $testimonial['testimonial'],
            'image' => $testimonial['image'] ? '/admin/uploads/' . $testimonial['image'] : null,
            'rating' => (int)$testimonial['rating']
        ];
        $tsTestimonials[] = $tsTestimonial;
    }
    return $tsTestimonials;
}

try {
    $tsProjects = convertProjectsToTS($projects);
    $tsTestimonials = convertTestimonialsToTS($testimonials);
    
    // Read the current portfolioData.ts file
    $portfolioFilePath = __DIR__ . '/../src/utils/portfolioData.ts';
    $portfolioContent = file_get_contents($portfolioFilePath);
    
    // Generate new project data as TypeScript
    $projectsJson = json_encode($tsProjects, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    $testimonialsJson = json_encode($tsTestimonials, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    // Convert JSON to TypeScript format
    $projectsTs = str_replace(['"', '{', '}', '[', ']'], ['', '{', '}', '[', ']'], $projectsJson);
    $projectsTs = preg_replace('/(\w+):\s/', '$1: ', $projectsTs);
    
    $testimonialsTs = str_replace(['"', '{', '}', '[', ']'], ['', '{', '}', '[', ']'], $testimonialsJson);
    $testimonialsTs = preg_replace('/(\w+):\s/', '$1: ', $testimonialsTs);
    
    // Update the projects array in the file
    $portfolioContent = preg_replace(
        '/export const projectData: Project\[\] = \[.*?\];/s',
        'export const projectData: Project[] = ' . $projectsJson . ';',
        $portfolioContent
    );
    
    // Update the testimonials array in the file
    $portfolioContent = preg_replace(
        '/export const testimonialData: Testimonial\[\] = \[.*?\];/s',
        'export const testimonialData: Testimonial[] = ' . $testimonialsJson . ';',
        $portfolioContent
    );
    
    // Write the updated content back to the file
    file_put_contents($portfolioFilePath, $portfolioContent);
    
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Data synchronized successfully!']);
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Sync failed: ' . $e->getMessage()]);
}
?>
