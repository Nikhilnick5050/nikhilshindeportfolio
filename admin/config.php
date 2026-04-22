<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'u383951428_pratikmane');
define('DB_PASS', 'Pratik@77221');
define('DB_NAME', 'u383951428_pratik');

// Admin credentials (you should change these)
define('ADMIN_EMAIL', '16pm2002@gmail.com');
define('ADMIN_PASSWORD', password_hash('Pratik@77221', PASSWORD_DEFAULT));

// Site configuration
define('SITE_URL', 'https://pratikmane.tech/');
define('ADMIN_URL', SITE_URL . '/admin');
define('UPLOAD_PATH', __DIR__ . '/uploads/');
define('UPLOAD_URL', SITE_URL . '/admin/uploads/');

// Create uploads directory if it doesn't exist
if (!file_exists(UPLOAD_PATH)) {
    mkdir(UPLOAD_PATH, 0755, true);
    mkdir(UPLOAD_PATH . 'projects/', 0755, true);
    mkdir(UPLOAD_PATH . 'testimonials/', 0755, true);
}

// Database connection
function getDBConnection()
{
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
    } catch (PDOException $e) {
        // Return JSON error instead of dying with text
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Database Connection Error: ' . $e->getMessage()]);
        exit();
    }
}

// Session management with security enhancements
function startSession()
{
    if (session_status() == PHP_SESSION_NONE) {
        // Set secure session cookie parameters
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        session_start();
    }
}

// Regenerate session ID after login (call this after successful authentication)
function regenerateSession()
{
    if (session_status() == PHP_SESSION_ACTIVE) {
        session_regenerate_id(true);
    }
}

// Authentication functions
function isLoggedIn()
{
    startSession();
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin()
{
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

// File upload helper
function uploadFile($file, $directory = 'projects')
{
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        return false;
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $uploadPath = UPLOAD_PATH . $directory . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return $directory . '/' . $filename;
    }

    return false;
}

// JSON data management
function getJsonData($type)
{
    $filePath = __DIR__ . "/../src/utils/portfolioData.ts";
    if (!file_exists($filePath)) {
        return [];
    }

    $content = file_get_contents($filePath);

    switch ($type) {
        case 'projects':
            if (preg_match('/export const projectData: Project\[\] = (\[.*?\]);/s', $content, $matches)) {
                return parseProjectData($matches[1]);
            }
            break;
        case 'testimonials':
            if (preg_match('/export const testimonialData: Testimonial\[\] = (\[.*?\]);/s', $content, $matches)) {
                return parseTestimonialData($matches[1]);
            }
            break;
    }

    return [];
}

function parseProjectData($jsArray)
{
    // This is a simplified parser - in production, you might want to use a proper JS parser
    // For now, we'll return sample data structure
    return [];
}

function parseTestimonialData($jsArray)
{
    // This is a simplified parser - in production, you might want to use a proper JS parser
    // For now, we'll return sample data structure
    return [];
}

// Utility functions
function sanitizeInput($input)
{
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function generateId($prefix = '')
{
    return $prefix . uniqid();
}

function redirectWithMessage($url, $message, $type = 'success')
{
    startSession();
    $_SESSION['flash_message'] = $message;
    $_SESSION['flash_type'] = $type;
    header("Location: $url");
    exit();
}

function getFlashMessage()
{
    startSession();
    if (isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        $type = $_SESSION['flash_type'] ?? 'info';
        unset($_SESSION['flash_message'], $_SESSION['flash_type']);
        return ['message' => $message, 'type' => $type];
    }
    return null;
}
?>