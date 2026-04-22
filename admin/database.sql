-- Portfolio Admin Panel Database Schema (CORRECTED VERSION)

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail VARCHAR(255),
    video_url VARCHAR(500),
    category ENUM('AR', 'VR', 'AR Filters', 'Game Development', 'Web Development', 'Mobile App') NOT NULL,
    technologies JSON,
    try_out_link VARCHAR(500),
    project_url VARCHAR(500),
    gallery_images JSON,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials table (CORRECTED - matches PHP code)
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    testimonial TEXT NOT NULL,  -- This column name matches the PHP code
    image VARCHAR(255),
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
INSERT IGNORE INTO admin_users (username, email, password) VALUES 
('admin', 'admin@pratikportfolio.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample data
INSERT IGNORE INTO projects (id, title, description, thumbnail, video_url, category, technologies, featured, try_out_link, project_url) VALUES
('proj1', 'Magic Pencil AR (Shaka Laka Boom Boom)', 'Interactive AR app that brings sketches to life by converting 2D drawings into 3D AR models using advanced AI detection and AR Foundation.', 'magic_pencil_ar.jpg', 'https://www.youtube.com/watch?v=30fZac2-Pe8', 'AR', '["Unity", "AR Foundation", "AI Detection", "C#", "Mobile Development"]', TRUE, '', 'https://github.com/pratik/magic-pencil-ar'),
('proj2', 'War of Tarot', 'Multiplayer AR card battle game where tarot cards come to life in 3D. Players can battle using real tarot cards detected through computer vision.', 'war_of_tarot.jpg', 'https://youtu.be/B7xVAdEey-c', 'AR', '["Unity", "AR Foundation", "Multiplayer", "Real-time Strategy", "Computer Vision"]', TRUE, '', 'https://github.com/pratik/war-of-tarot'),
('proj3', 'Alchemidx VR', 'Audio-based VR experience where players become sonic alchemists, manipulating sound waves and frequencies in virtual reality.', 'alchemidx_vr.jpg', 'https://youtu.be/SzjgNBEx0ok', 'VR', '["Unity", "VR SDK", "Spatial Audio", "Sound Design", "C#"]', TRUE, '', 'https://github.com/pratik/alchemidx-vr'),
('proj4', 'Portfolio Website', 'Modern React-based portfolio website with 3D elements, admin panel, and dynamic content management.', 'portfolio_website.jpg', '', 'Web Development', '["React", "TypeScript", "Three.js", "PHP", "MySQL"]', FALSE, 'https://pratikportfolio.com', 'https://github.com/pratik/portfolio');

-- Insert real testimonials (using INSERT IGNORE to prevent duplicate key errors)
INSERT IGNORE INTO testimonials (id, name, position, company, testimonial, rating) VALUES
('test1', 'Mohammed Sheikh', 'Founder & Chief Executive Officer', 'Augment Africa Innovations', 'I''ve had the pleasure of working closely with Pratik, and I can confidently say they are one of the most talented and forward-thinking developers I''ve come across.', 5),
('test2', 'Pratikshita Chowdhury', 'Manager', '1M1B Foundation', 'I recommend Pratik for his role as an exceptional educator for the Creators of Metaverse program.', 5),
('test3', 'Dredann', 'Marketing Coordinator', 'Fairmont Château Laurier', 'Working with Pratik was great. The team had excellent communication and really ensured to understand our vision.', 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

