<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

// Get statistics
$projectCount = $pdo->query("SELECT COUNT(*) as count FROM projects")->fetch()['count'];
$testimonialCount = $pdo->query("SELECT COUNT(*) as count FROM testimonials")->fetch()['count'];
$featuredProjectCount = $pdo->query("SELECT COUNT(*) as count FROM projects WHERE featured = 1")->fetch()['count'];

// Get recent projects
$recentProjects = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC LIMIT 5")->fetchAll();

// Get recent testimonials
$recentTestimonials = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 5")->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Pratik Portfolio Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.css" rel="stylesheet">
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
        
        .stats-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .stats-card:hover {
            transform: translateY(-5px);
        }
        
        .stats-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
        }
        
        .gradient-blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient-green { background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); }
        .gradient-orange { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .gradient-purple { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .table {
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .btn-primary {
            background: var(--primary-gradient);
            border: none;
        }
        
        .alert {
            border-radius: 10px;
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
            <a class="nav-link active" href="dashboard.php">
                <i class="fas fa-tachometer-alt me-2"></i> Dashboard
            </a>
            <a class="nav-link" href="projects.php">
                <i class="fas fa-project-diagram me-2"></i> Projects
            </a>
            <a class="nav-link" href="testimonials.php">
                <i class="fas fa-quote-left me-2"></i> Testimonials
            </a>
            <a class="nav-link" href="settings.php">
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
            <h1>Dashboard</h1>
            <div class="text-muted">
                <i class="fas fa-user me-2"></i>Welcome, Admin
            </div>
        </div>

        <!-- Flash Messages -->
        <?php if ($flash = getFlashMessage()): ?>
            <div class="alert alert-<?php echo $flash['type']; ?>">
                <?php echo $flash['message']; ?>
            </div>
        <?php endif; ?>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="d-flex align-items-center">
                        <div class="stats-icon gradient-blue">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <div class="ms-3">
                            <h3 class="mb-0"><?php echo $projectCount; ?></h3>
                            <p class="text-muted mb-0">Total Projects</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="d-flex align-items-center">
                        <div class="stats-icon gradient-green">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="ms-3">
                            <h3 class="mb-0"><?php echo $featuredProjectCount; ?></h3>
                            <p class="text-muted mb-0">Featured Projects</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="d-flex align-items-center">
                        <div class="stats-icon gradient-orange">
                            <i class="fas fa-quote-left"></i>
                        </div>
                        <div class="ms-3">
                            <h3 class="mb-0"><?php echo $testimonialCount; ?></h3>
                            <p class="text-muted mb-0">Testimonials</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="d-flex align-items-center">
                        <div class="stats-icon gradient-purple">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="ms-3">
                            <h3 class="mb-0">2.5K</h3>
                            <p class="text-muted mb-0">Page Views</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Content -->
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>Recent Projects</h5>
                        <a href="projects.php" class="btn btn-sm btn-primary">View All</a>
                    </div>
                    <div class="card-body">
                        <?php if (empty($recentProjects)): ?>
                            <p class="text-muted">No projects yet.</p>
                        <?php else: ?>
                            <?php foreach ($recentProjects as $project): ?>
                                <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                                    <div class="me-3">
                                        <span class="badge bg-primary"><?php echo $project['category']; ?></span>
                                    </div>
                                    <div>
                                        <h6 class="mb-1"><?php echo htmlspecialchars($project['title']); ?></h6>
                                        <small class="text-muted">
                                            <?php echo date('M d, Y', strtotime($project['created_at'])); ?>
                                        </small>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>Recent Testimonials</h5>
                        <a href="testimonials.php" class="btn btn-sm btn-primary">View All</a>
                    </div>
                    <div class="card-body">
                        <?php if (empty($recentTestimonials)): ?>
                            <p class="text-muted">No testimonials yet.</p>
                        <?php else: ?>
                            <?php foreach ($recentTestimonials as $testimonial): ?>
                                <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                                    <div class="me-3">
                                        <div class="text-warning">
                                            <?php for ($i = 0; $i < $testimonial['rating']; $i++): ?>
                                                <i class="fas fa-star"></i>
                                            <?php endfor; ?>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 class="mb-1"><?php echo htmlspecialchars($testimonial['name']); ?></h6>
                                        <small class="text-muted">
                                            <?php echo htmlspecialchars($testimonial['company']); ?>
                                        </small>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <a href="projects.php?action=add" class="btn btn-primary w-100 mb-2">
                                    <i class="fas fa-plus me-2"></i>Add New Project
                                </a>
                            </div>
                            <div class="col-md-3">
                                <a href="testimonials.php?action=add" class="btn btn-success w-100 mb-2">
                                    <i class="fas fa-plus me-2"></i>Add Testimonial
                                </a>
                            </div>
                            <div class="col-md-3">
                                <a href="export.php" class="btn btn-info w-100 mb-2">
                                    <i class="fas fa-download me-2"></i>Export Data
                                </a>
                            </div>
                            <div class="col-md-3">
                                <a href="settings.php" class="btn btn-warning w-100 mb-2">
                                    <i class="fas fa-cog me-2"></i>Settings
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
