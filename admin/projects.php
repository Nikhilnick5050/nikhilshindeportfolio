<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add':
                $id = generateId('proj');
                $title = sanitizeInput($_POST['title']);
                $description = sanitizeInput($_POST['description']);
                $category = sanitizeInput($_POST['category']);
                $technologies = json_encode(array_map('trim', explode(',', $_POST['technologies'])));
                $featured = isset($_POST['featured']) ? 1 : 0;
                $video_url = sanitizeInput($_POST['video_url']);
                $project_url = sanitizeInput($_POST['project_url']);

                // Handle thumbnail file upload
                $thumbnail = '';
                if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] == 0) {
                    $thumbnail = uploadFile($_FILES['thumbnail'], 'projects');
                }

                $stmt = $pdo->prepare("INSERT INTO projects (id, title, description, thumbnail, video_url, category, technologies, project_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $title, $description, $thumbnail, $video_url, $category, $technologies, $project_url, $featured]);

                redirectWithMessage('projects.php', 'Project added successfully!');
                break;
            case 'edit':
                $id = $_POST['id'];
                $title = sanitizeInput($_POST['title']);
                $description = sanitizeInput($_POST['description']);
                $category = sanitizeInput($_POST['category']);
                $technologies = json_encode(array_map('trim', explode(',', $_POST['technologies'])));
                $featured = isset($_POST['featured']) ? 1 : 0;
                $video_url = sanitizeInput($_POST['video_url']);
                $project_url = sanitizeInput($_POST['project_url']);

                // Handle thumbnail file upload
                $thumbnail_sql = '';
                $params = [$title, $description, $category, $technologies, $video_url, $project_url, $featured];

                if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] == 0) {
                    $thumbnail = uploadFile($_FILES['thumbnail'], 'projects');
                    $thumbnail_sql = ', thumbnail = ?';
                    $params[] = $thumbnail;
                }

                $params[] = $id;

                $stmt = $pdo->prepare("UPDATE projects SET title = ?, description = ?, category = ?, technologies = ?, video_url = ?, project_url = ?, featured = ?" . $thumbnail_sql . " WHERE id = ?");
                $stmt->execute($params);

                redirectWithMessage('projects.php', 'Project updated successfully!');
                break;

            case 'delete':
                $id = $_POST['id'];
                $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
                $stmt->execute([$id]);

                redirectWithMessage('projects.php', 'Project deleted successfully!');
                break;
        }
    }
}

// Handle GET requests
$action = $_GET['action'] ?? 'list';
$editProject = null;

if ($action == 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editProject = $stmt->fetch();
}

// Get all projects
$projects = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC")->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - Pratik Portfolio Admin</title>
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
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
            background: var(--primary-gradient);
            border: none;
        }

        .project-thumbnail {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
        }

        .badge {
            font-size: 0.75em;
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
            <a class="nav-link active" href="projects.php">
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
            <h1>Projects Management</h1>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#projectModal">
                <i class="fas fa-plus me-2"></i>Add New Project
            </button>
        </div>

        <!-- Flash Messages -->
        <?php if ($flash = getFlashMessage()): ?>
            <div class="alert alert-<?php echo $flash['type']; ?>">
                <?php echo $flash['message']; ?>
            </div>
        <?php endif; ?>

        <!-- Projects Table -->
        <div class="card">
            <div class="card-body">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Featured</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($projects as $project): ?>
                            <tr>
                                <td>
                                    <?php if ($project['thumbnail']): ?>
                                        <img src="uploads/<?php echo $project['thumbnail']; ?>"
                                            alt="<?php echo htmlspecialchars($project['title']); ?>" class="project-thumbnail">
                                    <?php else: ?>
                                        <div
                                            class="project-thumbnail bg-light d-flex align-items-center justify-content-center">
                                            <i class="fas fa-image text-muted"></i>
                                        </div>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <h6 class="mb-1"><?php echo htmlspecialchars($project['title']); ?></h6>
                                    <small class="text-muted">
                                        <?php echo substr(htmlspecialchars($project['description']), 0, 50) . '...'; ?>
                                    </small>
                                </td>
                                <td>
                                    <span class="badge bg-primary"><?php echo $project['category']; ?></span>
                                </td>
                                <td>
                                    <?php if ($project['featured']): ?>
                                        <span class="badge bg-success">
                                            <i class="fas fa-star"></i> Featured
                                        </span>
                                    <?php else: ?>
                                        <span class="badge bg-secondary">Regular</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($project['created_at'])); ?></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                        onclick="editProject('<?php echo $project['id']; ?>')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                        onclick="deleteProject('<?php echo $project['id']; ?>')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Project Modal -->
    <div class="modal fade" id="projectModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Add New Project</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="projectForm" method="POST" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="action" id="formAction" value="add">
                        <input type="hidden" name="id" id="projectId">

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="title" name="title" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="category" class="form-label">Category</label>
                                    <select class="form-select" id="category" name="category" required>
                                        <option value="">Select Category</option>
                                        <option value="AR">AR</option>
                                        <option value="VR">VR</option>
                                        <option value="AR Filters">AR Filters</option>
                                        <option value="Game Development">Game Development</option>
                                        <option value="3D/CGI">3D/CGI</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3"
                                required></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="technologies" class="form-label">Technologies (comma-separated)</label>
                            <input type="text" class="form-control" id="technologies" name="technologies"
                                placeholder="Unity, AR Foundation, C#">
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="video_url" class="form-label">Video URL</label>
                                    <input type="url" class="form-control" id="video_url" name="video_url">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="thumbnail" class="form-label">Thumbnail Image</label>
                                    <input type="file" class="form-control" id="thumbnail" name="thumbnail"
                                        accept="image/*">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3"> </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="project_url" class="form-label">Project URL</label>
                                    <input type="url" class="form-control" id="project_url" name="project_url">
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="featured" name="featured">
                                <label class="form-check-label" for="featured">
                                    Featured Project
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Project</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete Form (hidden) -->
    <form id="deleteForm" method="POST" style="display: none;">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="id" id="deleteId">
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function editProject(id) {
            // Find the project data
            fetch(`get_project.php?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('modalTitle').textContent = 'Edit Project';
                    document.getElementById('formAction').value = 'edit';
                    document.getElementById('projectId').value = data.id;
                    document.getElementById('title').value = data.title;
                    document.getElementById('description').value = data.description;
                    document.getElementById('category').value = data.category; document.getElementById('technologies').value = JSON.parse(data.technologies).join(', ');
                    document.getElementById('video_url').value = data.video_url || '';
                    document.getElementById('project_url').value = data.project_url || '';
                    document.getElementById('featured').checked = data.featured == 1;

                    new bootstrap.Modal(document.getElementById('projectModal')).show();
                });
        }

        function deleteProject(id) {
            if (confirm('Are you sure you want to delete this project?')) {
                document.getElementById('deleteId').value = id;
                document.getElementById('deleteForm').submit();
            }
        }

        // Reset form when modal is closed
        document.getElementById('projectModal').addEventListener('hidden.bs.modal', function () {
            document.getElementById('projectForm').reset();
            document.getElementById('modalTitle').textContent = 'Add New Project';
            document.getElementById('formAction').value = 'add';
            document.getElementById('projectId').value = '';
        });
    </script>
</body>

</html>