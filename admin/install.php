<?php
/**
 * Portfolio Admin Panel Installation Script
 * Run this once to set up the database and initial configuration
 */

// Check if already installed
if (file_exists('config.php')) {
    $config = file_get_contents('config.php');
    if (strpos($config, 'your_db_user') === false) {
        die('Admin panel is already installed. Delete config.php to reinstall.');
    }
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $dbHost = $_POST['db_host'] ?? 'localhost';
    $dbName = $_POST['db_name'] ?? '';
    $dbUser = $_POST['db_user'] ?? '';
    $dbPass = $_POST['db_pass'] ?? '';
    $adminEmail = $_POST['admin_email'] ?? '';
    $adminPassword = $_POST['admin_password'] ?? '';
    $siteUrl = $_POST['site_url'] ?? '';
    
    if (empty($dbName) || empty($dbUser) || empty($adminEmail) || empty($adminPassword) || empty($siteUrl)) {
        $error = 'All fields are required.';
    } else {
        try {
            // Test database connection
            $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Create tables
            $sql = file_get_contents('database.sql');
            $pdo->exec($sql);
            
            // Create config file
            $configContent = "<?php
// Database configuration
define('DB_HOST', '$dbHost');
define('DB_USER', '$dbUser');
define('DB_PASS', '$dbPass');
define('DB_NAME', '$dbName');

// Admin credentials
define('ADMIN_EMAIL', '$adminEmail');
define('ADMIN_PASSWORD', '" . password_hash($adminPassword, PASSWORD_DEFAULT) . "');

// Site configuration
define('SITE_URL', '$siteUrl');
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
function getDBConnection() {
    try {
        \$pdo = new PDO(\"mysql:host=\" . DB_HOST . \";dbname=\" . DB_NAME, DB_USER, DB_PASS);
        \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return \$pdo;
    } catch(PDOException \$e) {
        die(\"Connection failed: \" . \$e->getMessage());
    }
}

// Session management
function startSession() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

// Authentication functions
function isLoggedIn() {
    startSession();
    return isset(\$_SESSION['admin_logged_in']) && \$_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

// File upload helper
function uploadFile(\$file, \$directory = 'projects') {
    if (!isset(\$file) || \$file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    \$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array(\$file['type'], \$allowedTypes)) {
        return false;
    }
    
    \$extension = pathinfo(\$file['name'], PATHINFO_EXTENSION);
    \$filename = uniqid() . '.' . \$extension;
    \$uploadPath = UPLOAD_PATH . \$directory . '/' . \$filename;
    
    if (move_uploaded_file(\$file['tmp_name'], \$uploadPath)) {
        return \$directory . '/' . \$filename;
    }
    
    return false;
}

// Utility functions
function sanitizeInput(\$input) {
    return htmlspecialchars(trim(\$input), ENT_QUOTES, 'UTF-8');
}

function generateId(\$prefix = '') {
    return \$prefix . uniqid();
}

function redirectWithMessage(\$url, \$message, \$type = 'success') {
    startSession();
    \$_SESSION['flash_message'] = \$message;
    \$_SESSION['flash_type'] = \$type;
    header(\"Location: \$url\");
    exit();
}

function getFlashMessage() {
    startSession();
    if (isset(\$_SESSION['flash_message'])) {
        \$message = \$_SESSION['flash_message'];
        \$type = \$_SESSION['flash_type'] ?? 'info';
        unset(\$_SESSION['flash_message'], \$_SESSION['flash_type']);
        return ['message' => \$message, 'type' => \$type];
    }
    return null;
}
?>";
            
            file_put_contents('config.php', $configContent);
            
            // Create uploads directories
            if (!file_exists('uploads')) {
                mkdir('uploads', 0755, true);
                mkdir('uploads/projects', 0755, true);
                mkdir('uploads/testimonials', 0755, true);
            }
            
            $success = 'Installation completed successfully! You can now <a href="login.php">login to your admin panel</a>.';
            
        } catch (Exception $e) {
            $error = 'Installation failed: ' . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Admin Panel - Installation</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        .install-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            overflow: hidden;
            max-width: 600px;
            margin: 0 auto;
        }
        .install-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .install-body {
            padding: 2rem;
        }
        .form-control {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-install {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            padding: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="install-container">
            <div class="install-header">
                <i class="fas fa-cogs fa-3x mb-3"></i>
                <h2>Portfolio Admin Panel</h2>
                <p class="mb-0">Installation Setup</p>
            </div>
            <div class="install-body">
                <?php if ($error): ?>
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($success): ?>
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i> <?php echo $success; ?>
                    </div>
                <?php else: ?>
                    <form method="POST">
                        <h5 class="mb-3">Database Configuration</h5>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="db_host" class="form-label">Database Host</label>
                                    <input type="text" class="form-control" id="db_host" name="db_host" 
                                           value="localhost" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="db_name" class="form-label">Database Name</label>
                                    <input type="text" class="form-control" id="db_name" name="db_name" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="db_user" class="form-label">Database User</label>
                                    <input type="text" class="form-control" id="db_user" name="db_user" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="db_pass" class="form-label">Database Password</label>
                                    <input type="password" class="form-control" id="db_pass" name="db_pass">
                                </div>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <h5 class="mb-3">Admin Account</h5>
                        
                        <div class="mb-3">
                            <label for="admin_email" class="form-label">Admin Email</label>
                            <input type="email" class="form-control" id="admin_email" name="admin_email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="admin_password" class="form-label">Admin Password</label>
                            <input type="password" class="form-control" id="admin_password" name="admin_password" 
                                   minlength="8" required>
                            <small class="text-muted">Minimum 8 characters</small>
                        </div>
                        
                        <hr>
                        
                        <h5 class="mb-3">Site Configuration</h5>
                        
                        <div class="mb-3">
                            <label for="site_url" class="form-label">Site URL</label>
                            <input type="url" class="form-control" id="site_url" name="site_url" 
                                   placeholder="https://your-domain.com" required>
                            <small class="text-muted">Your website URL (without trailing slash)</small>
                        </div>
                        
                        <button type="submit" class="btn btn-install btn-primary w-100">
                            <i class="fas fa-download me-2"></i>Install Admin Panel
                        </button>
                    </form>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
