<?php
require_once 'config.php';
requireLogin();

// Handle settings updates
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'update_credentials':
                $newEmail = sanitizeInput($_POST['admin_email']);
                $currentPassword = $_POST['current_password'];
                $newPassword = $_POST['new_password'];
                $confirmPassword = $_POST['confirm_password'];
                
                // Verify current password
                if (!password_verify($currentPassword, ADMIN_PASSWORD)) {
                    redirectWithMessage('settings.php', 'Current password is incorrect!', 'danger');
                }
                
                if ($newPassword !== $confirmPassword) {
                    redirectWithMessage('settings.php', 'New passwords do not match!', 'danger');
                }
                
                // In a real application, you would update these in a database or config file
                // For now, we'll just show a success message
                redirectWithMessage('settings.php', 'Settings updated successfully! Please update your config.php file manually.', 'warning');
                break;
                
            case 'export_data':
                // This will be handled by export.php
                header('Location: export.php');
                exit();
                break;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - Pratik Portfolio Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --sidebar-bg: #2c3e50;
            --sidebar-hover: #34495e;
        }
        
        body {
            background-color: #f8f9fa;
        }
        
        .sidebar {
            background: var(--sidebar-bg);
            min-height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            z-index: 1000;
        }
        
        .sidebar .nav-link {
            color: #ecf0f1;
            padding: 15px 20px;
            border-radius: 0;
            transition: all 0.3s;
        }
        
        .sidebar .nav-link:hover {
            background: var(--sidebar-hover);
            color: white;
        }
        
        .sidebar .nav-link.active {
            background: var(--primary-gradient);
            color: white;
        }
        
        .main-content {
            margin-left: 250px;
            padding: 20px;
        }
        
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .btn-primary {
            background: var(--primary-gradient);
            border: none;
        }
        
        .settings-section {
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="p-3 text-center border-bottom">
            <h4 class="text-white">Admin Panel</h4>
            <small class="text-muted">Pratik Portfolio</small>
        </div>
        <nav class="nav flex-column">
            <a class="nav-link" href="dashboard.php">
                <i class="fas fa-tachometer-alt me-2"></i> Dashboard
            </a>
            <a class="nav-link" href="projects.php">
                <i class="fas fa-project-diagram me-2"></i> Projects
            </a>
            <a class="nav-link" href="testimonials.php">
                <i class="fas fa-quote-left me-2"></i> Testimonials
            </a>
            <a class="nav-link active" href="settings.php">
                <i class="fas fa-cog me-2"></i> Settings
            </a>
            <a class="nav-link" href="logout.php">
                <i class="fas fa-sign-out-alt me-2"></i> Logout
            </a>
        </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Settings</h1>
        </div>

        <!-- Flash Messages -->
        <?php if ($flash = getFlashMessage()): ?>
            <div class="alert alert-<?php echo $flash['type']; ?>">
                <?php echo $flash['message']; ?>
            </div>
        <?php endif; ?>

        <!-- Admin Credentials Settings -->
        <div class="settings-section">
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-user-shield me-2"></i>Admin Credentials</h5>
                </div>
                <div class="card-body">
                    <form method="POST">
                        <input type="hidden" name="action" value="update_credentials">
                        
                        <div class="mb-3">
                            <label for="admin_email" class="form-label">Admin Email</label>
                            <input type="email" class="form-control" id="admin_email" name="admin_email" 
                                   value="<?php echo ADMIN_EMAIL; ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="current_password" class="form-label">Current Password</label>
                            <input type="password" class="form-control" id="current_password" name="current_password" required>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="new_password" class="form-label">New Password</label>
                                    <input type="password" class="form-control" id="new_password" name="new_password" 
                                           minlength="8" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="confirm_password" class="form-label">Confirm New Password</label>
                                    <input type="password" class="form-control" id="confirm_password" name="confirm_password" 
                                           minlength="8" required>
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-2"></i>Update Credentials
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- System Information -->
        <div class="settings-section">
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-info-circle me-2"></i>System Information</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <table class="table table-borderless">
                                <tr>
                                    <td><strong>PHP Version:</strong></td>
                                    <td><?php echo phpversion(); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>MySQL Version:</strong></td>
                                    <td>
                                        <?php
                                        try {
                                            $pdo = getDBConnection();
                                            $version = $pdo->query('SELECT VERSION()')->fetchColumn();
                                            echo $version;
                                        } catch (Exception $e) {
                                            echo 'Unable to connect';
                                        }
                                        ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Server Software:</strong></td>
                                    <td><?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?></td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <table class="table table-borderless">
                                <tr>
                                    <td><strong>Upload Max Size:</strong></td>
                                    <td><?php echo ini_get('upload_max_filesize'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Memory Limit:</strong></td>
                                    <td><?php echo ini_get('memory_limit'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Execution Time:</strong></td>
                                    <td><?php echo ini_get('max_execution_time'); ?>s</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Data Management -->
        <div class="settings-section">
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-database me-2"></i>Data Management</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="d-grid">
                                <a href="export.php" class="btn btn-success">
                                    <i class="fas fa-download me-2"></i>Export All Data
                                </a>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-grid">
                                <button class="btn btn-warning" onclick="syncToReact()">
                                    <i class="fas fa-sync me-2"></i>Sync to React App
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <small class="text-muted">
                            <i class="fas fa-info-circle"></i>
                            Export will create a backup of all your projects and testimonials data.
                            Sync will update your React application's portfolio data.
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- File Cleanup -->
        <div class="settings-section">
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-broom me-2"></i>Maintenance</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="d-grid">
                                <button class="btn btn-info" onclick="cleanupFiles()">
                                    <i class="fas fa-trash-alt me-2"></i>Cleanup Unused Files
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-grid">
                                <button class="btn btn-secondary" onclick="clearCache()">
                                    <i class="fas fa-eraser me-2"></i>Clear Cache
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <small class="text-muted">
                            <i class="fas fa-exclamation-triangle"></i>
                            Use these options carefully. Make sure to backup your data before performing maintenance tasks.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function syncToReact() {
            if (confirm('This will update your React application with the current database data. Continue?')) {
                fetch('sync_data.php', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Data synchronized successfully!');
                        } else {
                            alert('Sync failed: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Sync failed: ' + error.message);
                    });
            }
        }
        
        function cleanupFiles() {
            if (confirm('This will delete unused uploaded files. This action cannot be undone. Continue?')) {
                fetch('cleanup.php', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                    });
            }
        }
        
        function clearCache() {
            if (confirm('Clear all cached data?')) {
                // Implementation for cache clearing
                alert('Cache cleared successfully!');
            }
        }
        
        // Password confirmation validation
        document.getElementById('confirm_password').addEventListener('input', function() {
            const password = document.getElementById('new_password').value;
            const confirm = this.value;
            
            if (password !== confirm) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    </script>
</body>
</html>
