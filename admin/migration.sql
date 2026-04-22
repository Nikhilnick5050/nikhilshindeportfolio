-- MIGRATION SCRIPT: Update existing database structure without losing data
-- Run this if you have existing data you want to keep

-- First, check if we need to rename the column in testimonials table
-- If your testimonials table has a column named 'content' instead of 'testimonial', run this:
-- ALTER TABLE testimonials CHANGE COLUMN content testimonial TEXT NOT NULL;

-- Add missing columns if they don't exist
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS rating INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add missing columns to projects if they don't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS try_out_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS project_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS gallery_images JSON,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update projects category enum to include more options
ALTER TABLE projects MODIFY COLUMN category ENUM('AR', 'VR', 'AR Filters', 'Game Development', 'Web Development', 'Mobile App') NOT NULL;

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user if not exists
INSERT IGNORE INTO admin_users (username, email, password) VALUES 
('admin', 'admin@pratikportfolio.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Create admin_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance (will be ignored if they already exist)
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
