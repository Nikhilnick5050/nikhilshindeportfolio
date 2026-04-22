<?php
require_once 'config.php';
requireLogin();

$pdo = getDBConnection();

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add':
                $id = generateId('test');
                $name = sanitizeInput($_POST['name']);
                $position = sanitizeInput($_POST['position']);
                $company = sanitizeInput($_POST['company']);
                $testimonial = sanitizeInput($_POST['testimonial']);
                $rating = intval($_POST['rating']);
                
                // Handle file upload
                $image = '';
                if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                    $image = uploadFile($_FILES['image'], 'testimonials');
                }
                
                $stmt = $pdo->prepare("INSERT INTO testimonials (id, name, position, company, testimonial, image, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $name, $position, $company, $testimonial, $image, $rating]);
                
                redirectWithMessage('testimonials.php', 'Testimonial added successfully!');
                break;
                
            case 'edit':
                $id = $_POST['id'];
                $name = sanitizeInput($_POST['name']);
                $position = sanitizeInput($_POST['position']);
                $company = sanitizeInput($_POST['company']);
                $testimonial = sanitizeInput($_POST['testimonial']);
                $rating = intval($_POST['rating']);
                
                // Handle file upload
                $image_sql = '';
                $params = [$name, $position, $company, $testimonial, $rating];
                
                if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                    $image = uploadFile($_FILES['image'], 'testimonials');
                    $image_sql = ', image = ?';
                    $params[] = $image;
                }
                
                $params[] = $id;
                
                $stmt = $pdo->prepare("UPDATE testimonials SET name = ?, position = ?, company = ?, testimonial = ?, rating = ?" . $image_sql . " WHERE id = ?");
                $stmt->execute($params);
                
                redirectWithMessage('testimonials.php', 'Testimonial updated successfully!');
                break;
                
            case 'delete':
                $id = $_POST['id'];
                $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
                $stmt->execute([$id]);
                
                redirectWithMessage('testimonials.php', 'Testimonial deleted successfully!');
                break;
        }
    }
}

// Get all testimonials
$testimonials = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testimonials - Pratik Portfolio Admin</title>
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
        
        .testimonial-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 50%;
        }
        
        .rating-stars {
            color: #ffc107;
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
            <a class="nav-link active" href="testimonials.php">
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
            <h1>Testimonials Management</h1>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#testimonialModal">
                <i class="fas fa-plus me-2"></i>Add New Testimonial
            </button>
        </div>

        <!-- Flash Messages -->
        <?php if ($flash = getFlashMessage()): ?>
            <div class="alert alert-<?php echo $flash['type']; ?>">
                <?php echo $flash['message']; ?>
            </div>
        <?php endif; ?>

        <!-- Testimonials Table -->
        <div class="card">
            <div class="card-body">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Rating</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($testimonials as $testimonial): ?>
                            <tr>
                                <td>
                                    <?php if ($testimonial['image']): ?>
                                        <img src="uploads/<?php echo $testimonial['image']; ?>" 
                                             alt="<?php echo htmlspecialchars($testimonial['name']); ?>" 
                                             class="testimonial-image">
                                    <?php else: ?>
                                        <div class="testimonial-image bg-light d-flex align-items-center justify-content-center">
                                            <i class="fas fa-user text-muted"></i>
                                        </div>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <h6 class="mb-1"><?php echo htmlspecialchars($testimonial['name']); ?></h6>
                                    <small class="text-muted">
                                        <?php echo substr(htmlspecialchars($testimonial['testimonial']), 0, 50) . '...'; ?>
                                    </small>
                                </td>
                                <td>
                                    <div>
                                        <strong><?php echo htmlspecialchars($testimonial['position']); ?></strong>
                                        <br>
                                        <small class="text-muted"><?php echo htmlspecialchars($testimonial['company']); ?></small>
                                    </div>
                                </td>
                                <td>
                                    <div class="rating-stars">
                                        <?php for ($i = 0; $i < $testimonial['rating']; $i++): ?>
                                            <i class="fas fa-star"></i>
                                        <?php endfor; ?>
                                        <?php for ($i = $testimonial['rating']; $i < 5; $i++): ?>
                                            <i class="far fa-star"></i>
                                        <?php endfor; ?>
                                    </div>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($testimonial['created_at'])); ?></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" 
                                            onclick="editTestimonial('<?php echo $testimonial['id']; ?>')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" 
                                            onclick="deleteTestimonial('<?php echo $testimonial['id']; ?>')">
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

    <!-- Testimonial Modal -->
    <div class="modal fade" id="testimonialModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Add New Testimonial</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="testimonialForm" method="POST" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="action" id="formAction" value="add">
                        <input type="hidden" name="id" id="testimonialId">
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="name" name="name" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="position" class="form-label">Position</label>
                                    <input type="text" class="form-control" id="position" name="position" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="company" class="form-label">Company</label>
                                    <input type="text" class="form-control" id="company" name="company" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="rating" class="form-label">Rating</label>
                                    <select class="form-select" id="rating" name="rating" required>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="testimonial" class="form-label">Testimonial</label>
                            <textarea class="form-control" id="testimonial" name="testimonial" rows="4" required></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label for="image" class="form-label">Profile Image (Optional)</label>
                            <input type="file" class="form-control" id="image" name="image" accept="image/*">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Testimonial</button>
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
        function editTestimonial(id) {
            // Find the testimonial data
            fetch(`get_testimonial.php?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('modalTitle').textContent = 'Edit Testimonial';
                    document.getElementById('formAction').value = 'edit';
                    document.getElementById('testimonialId').value = data.id;
                    document.getElementById('name').value = data.name;
                    document.getElementById('position').value = data.position;
                    document.getElementById('company').value = data.company;
                    document.getElementById('testimonial').value = data.testimonial;
                    document.getElementById('rating').value = data.rating;
                    
                    new bootstrap.Modal(document.getElementById('testimonialModal')).show();
                });
        }
        
        function deleteTestimonial(id) {
            if (confirm('Are you sure you want to delete this testimonial?')) {
                document.getElementById('deleteId').value = id;
                document.getElementById('deleteForm').submit();
            }
        }
        
        // Reset form when modal is closed
        document.getElementById('testimonialModal').addEventListener('hidden.bs.modal', function () {
            document.getElementById('testimonialForm').reset();
            document.getElementById('modalTitle').textContent = 'Add New Testimonial';
            document.getElementById('formAction').value = 'add';
            document.getElementById('testimonialId').value = '';
        });
    </script>
</body>
</html>
