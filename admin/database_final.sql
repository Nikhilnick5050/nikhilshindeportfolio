-- ✅ PRATIK PORTFOLIO DATABASE SCHEMA (PRODUCTION-READY VERSION)
-- 🎯 Only the tables you actually need: Projects, Testimonials, Admin Users

-- Create tables if they don't exist
-- 1. Admin users table (for login)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Projects table (exactly matching your PHP code - NO THUMBNAIL OR TRY_OUT_LINK)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    video_url VARCHAR(500),
    category ENUM('AR', 'VR', 'AR Filters', 'Game Development', '3D/CGI', 'Web Development', 'Mobile App') NOT NULL,
    technologies JSON,
    project_url VARCHAR(500),
    gallery_images JSON,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Testimonials table (exactly matching your PHP code)
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    testimonial TEXT NOT NULL,
    image VARCHAR(255),
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user with your custom credentials
INSERT IGNORE INTO admin_users (username, email, password) VALUES 
('admin', 'admin@pratikmane.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- Password: Pratik@Admin77221

-- Insert your real projects from portfolioData.ts
INSERT INTO projects (id, title, description, video_url, category, technologies, project_url, gallery_images, featured, created_at, updated_at) VALUES
-- AR Projects first - Magic Pencil and War of Tarot featured
('proj1', 'Magic Pencil AR (Shaka Laka Boom Boom)', 'Interactive AR app that brings sketches to life by converting 2D drawings into 3D AR models. Users draw objects on paper, scan them with their device, and watch them transform into augmented reality experiences.', 'https://www.youtube.com/watch?v=30fZac2-Pe8', 'AR', '["Unity", "AR Foundation", "AI Detection", "C#", "Mobile Development"]', NULL, NULL, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

('proj2', 'War of Tarot', 'Multiplayer AR card battle game where tarot cards come to life in 3D. Players engage in strategic real-time battles, casting spells and activating unique abilities to defeat opponents.', 'https://youtu.be/B7xVAdEey-c', 'AR', '["Unity", "AR Foundation", "Multiplayer", "Real-time Strategy"]', NULL, NULL, 1, '2024-01-02 10:00:00', '2024-01-02 10:00:00'),

('proj3', 'Web AR Image Tracking', 'Web-based AR experience that displays multiple 3D models when users scan image targets. Models can be interacted with, rotated, and explored from various angles in real-time.', 'https://www.youtube.com/watch?v=KOTAujQ7I6w', 'AR', '["WebAR", "Image Tracking", "3D Models", "Interactive AR"]', NULL, NULL, 0, '2024-01-03 10:00:00', '2024-01-03 10:00:00'),

('proj4', 'Web AR Odella', 'Web AR application that displays a 3D logo in augmented reality when scanning an image. Features interactive positioning, scaling, and screenshot capture functionality.', 'https://www.youtube.com/watch?v=wQaUfuZkQy4', 'AR', '["WebAR", "3D Logo", "Screenshot Capture"]', NULL, NULL, 0, '2024-01-04 10:00:00', '2024-01-04 10:00:00'),

('proj11', 'AR Dart Game', 'AR dart game bringing the classic pub experience to digital world. Features realistic physics simulation, multiple game modes, and competitive scoring system.', 'https://youtu.be/IYIlNI_cp-8', 'AR', '["Unity", "AR Foundation", "Physics Simulation", "Game Mechanics", "Mobile AR"]', NULL, NULL, 0, '2024-01-05 10:00:00', '2024-01-05 10:00:00'),

('proj12', 'AR Gravel Try-On', 'AR application for visualizing gravel and stone textures in real environments. Perfect for landscaping and construction planning applications.', 'https://youtu.be/7ZSLI6DAa-k', 'AR', '["AR Try-On", "Material Visualization", "Real-time Rendering", "Unity", "Mobile AR"]', NULL, NULL, 1, '2024-01-06 10:00:00', '2024-01-06 10:00:00'),

('proj15', 'AR Shoes Try-On', 'AR shoe try-on app using foot tracking and 3D rendering to place virtual shoes on user\'s feet. Perfect for online shopping and retail experiences.', 'https://youtu.be/9BM4Y8ciJ2g?feature=share', 'AR', '["AR Try-On", "Foot Tracking", "3D Rendering", "Unity", "Mobile AR", "E-commerce"]', NULL, NULL, 0, '2024-01-07 10:00:00', '2024-01-07 10:00:00'),

-- VR Projects second - Alchemidx, Rise VR, and Christmas VR featured
('proj5', 'Alchemidx VR', 'Audio-based VR experience where players become sonic alchemists, collecting unique sound ingredients and mixing them in cauldrons to create evolving music compositions.', 'https://youtu.be/SzjgNBEx0ok', 'VR', '["Unity", "VR SDK", "Spatial Audio", "Sound Design"]', NULL, NULL, 1, '2024-01-08 10:00:00', '2024-01-08 10:00:00'),

('proj6', 'BOSS VR', 'Festive VR game where players help Santa catch falling gifts in a Christmas environment. Features quick reflexes gameplay with immersive holiday visuals and sounds.', 'https://www.youtube.com/watch?v=C15B6c8VW0M', 'VR', '["Unity", "VR SDK", "Game Mechanics"]', NULL, NULL, 0, '2024-01-09 10:00:00', '2024-01-09 10:00:00'),

('proj7', 'Rise VR Multiplayer Game', 'Fast-paced multiplayer VR racing game in vertical 3D space with Mario Kart-style gameplay. Players use various movement styles and power-ups to reach the finish line first.', 'https://youtu.be/hOyBFXx_4uQ', 'VR', '["Unity", "VR Multiplayer", "Physics Simulation"]', NULL, NULL, 1, '2024-01-10 10:00:00', '2024-01-10 10:00:00'),

('proj8', 'OTD VR - Decision Making Game', 'VR decision-making game with 360-degree video environments. Players make critical choices that affect outcomes in realistic scenarios.', 'https://www.youtube.com/watch?v=KgBCA2CKhqc', 'VR', '["Unity", "360 Video", "VR SDK"]', NULL, NULL, 0, '2024-01-11 10:00:00', '2024-01-11 10:00:00'),

('proj9', 'Christmas VR Experience', 'Immersive Christmas-themed VR experience with festive environments, decorations, and holiday activities. Features winter landscapes and cozy indoor scenes.', 'https://www.youtube.com/watch?v=VV_7bjRWkuk', 'VR', '["Unity", "VR SDK", "Environmental Design"]', NULL, NULL, 1, '2024-01-12 10:00:00', '2024-01-12 10:00:00'),

('proj13', 'VR Gmail Integration', 'Revolutionary VR email management system integrating Gmail in 3D space. Features intuitive VR controls and spatial UI design for futuristic email experience.', 'https://youtu.be/5EjjfJP4jSg', 'VR', '["Unity", "VR SDK", "Gmail API", "Spatial UI", "Email Integration", "Web Services"]', NULL, NULL, 0, '2024-01-13 10:00:00', '2024-01-13 10:00:00'),

('proj14', 'VR Shooting Game Simulator', 'Immersive VR shooting simulator with realistic weapon handling and target practice. Features multiple scenarios, weapon types, and accurate ballistics simulation.', 'https://youtu.be/fZzzNLJ1Lbc', 'VR', '["Unity", "VR SDK", "Physics Simulation", "Weapon Mechanics", "Target System", "Haptic Feedback"]', NULL, NULL, 0, '2024-01-14 10:00:00', '2024-01-14 10:00:00'),

-- AR Filters third - None featured
('filter1', 'Money Heist Character Filter', 'AR filter that matches users with Money Heist characters using facial recognition and AI analysis. Features character masks and themed overlays.', 'https://youtu.be/JpbLHT8B1HQ?feature=share', 'AR Filters', '["Spark AR", "Facial Recognition", "Character Matching", "Social Media", "AI Analysis"]', NULL, NULL, 0, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),

('filter2', 'Sweet Collector Diwali Game Filter', 'Interactive Diwali AR filter game where users collect virtual sweets and treats. Perfect for social media sharing during festival season.', 'https://youtu.be/Ct2DNx2fXyA?feature=share', 'AR Filters', '["Spark AR", "Interactive Games", "Festival Theme", "Particle Systems", "Social Media"]', NULL, NULL, 0, '2024-01-16 10:00:00', '2024-01-16 10:00:00'),

('filter3', 'Ram Mandir Filter', 'Spiritual AR filter celebrating Ram Mandir with 3D models, religious symbols, and devotional overlays for cultural connection.', 'https://youtu.be/cM1a9FzE8rE?feature=share', 'AR Filters', '["Spark AR", "Cultural Content", "3D Modeling", "Religious Themes", "Social Media"]', NULL, NULL, 0, '2024-01-17 10:00:00', '2024-01-17 10:00:00'),

('filter4', 'Christmas Filter', 'Magical Christmas AR filter with Santa hats, snowfall effects, and festive overlays. Transform your environment into a winter wonderland.', 'https://youtu.be/JG6IpHjHZZw?feature=share', 'AR Filters', '["Spark AR", "Holiday Theme", "Particle Effects", "Environmental AR", "Social Media"]', NULL, NULL, 0, '2024-01-18 10:00:00', '2024-01-18 10:00:00'),

('filter5', 'Bomberman AR Filter', 'Nostalgic AR filter inspired by classic Bomberman game. Features pixel art styling, explosion effects, and retro gaming elements.', 'https://youtu.be/BMdgrzdQCRg?feature=share', 'AR Filters', '["Spark AR", "Retro Gaming", "Pixel Art", "Interactive Elements", "Game-inspired"]', NULL, NULL, 0, '2024-01-19 10:00:00', '2024-01-19 10:00:00'),

('filter6', 'Video Call with Kriti AR Filter', 'Innovative AR filter simulating video call experience with virtual character Kriti. Features realistic facial animations and dynamic responses.', 'https://youtu.be/6YQHY0LKVb8?feature=share', 'AR Filters', '["Spark AR", "Virtual Character", "Face Animation", "Interactive Media", "Social Communication"]', NULL, NULL, 0, '2024-01-20 10:00:00', '2024-01-20 10:00:00'),

-- Game Development fourth - None featured  
('proj10', 'Lottery Simulator Game', 'Functional lottery machine simulator with automatic and manual draw modes. Features customizable controls and administrative interface for game flow management.', 'https://youtu.be/FgF03Zu2B6o', 'Game Development', '["Unity", "Game Mechanics", "UI/UX Design", "Random Systems", "Administrative Controls"]', NULL, NULL, 0, '2024-01-21 10:00:00', '2024-01-21 10:00:00'),

-- 3D/CGI Projects last - None featured
('cgi1', 'Hyphen CGI Commercial', 'High-quality CGI commercial for Hyphen brand featuring photorealistic product visualization and dynamic animations. Showcases advanced rendering techniques and professional lighting setups.', 'https://youtu.be/S1RfAewgwHs', '3D/CGI', '["Blender", "Cinema 4D", "Arnold Renderer", "Product Visualization", "Commercial CGI"]', NULL, NULL, 0, '2024-01-22 10:00:00', '2024-01-22 10:00:00'),

('cgi2', 'Hyphen Lip Balm CGI', 'Stunning 3D product visualization for Hyphen lip balm featuring realistic textures, materials, and elegant product presentation for marketing campaigns.', 'https://youtu.be/ZhZSPd6cby0', '3D/CGI', '["Blender", "Product Modeling", "Photorealistic Rendering", "Material Shading", "Beauty Products"]', NULL, NULL, 0, '2024-01-23 10:00:00', '2024-01-23 10:00:00'),

('cgi3', 'Burger King CGI Commercial', 'Appetizing food visualization for Burger King showcasing realistic food rendering, dynamic animations, and commercial-grade CGI for advertising purposes.', 'https://youtube.com/watch?v=7LGTpWc3w9Y', '3D/CGI', '["Cinema 4D", "Food Visualization", "Commercial Animation", "Realistic Textures", "Brand Advertising"]', NULL, NULL, 0, '2024-01-24 10:00:00', '2024-01-24 10:00:00'),

('cgi4', 'Hyphen Birthday CGI', 'Celebratory CGI animation for Hyphen\'s birthday campaign featuring festive elements, particle effects, and brand-focused visual storytelling.', 'https://youtube.com/watch?v=u4vq8Y76yeQ', '3D/CGI', '["Blender", "Particle Systems", "Celebration Animation", "Brand Marketing", "Motion Graphics"]', NULL, NULL, 0, '2024-01-25 10:00:00', '2024-01-25 10:00:00'),

('cgi5', 'Hyphen Dewy Drop CGI', 'Elegant product visualization showcasing Hyphen\'s Dewy Drop product with realistic water effects, sophisticated lighting, and premium product presentation.', 'https://youtube.com/watch?v=Q1sxbQqQKv8', '3D/CGI', '["Blender", "Fluid Simulation", "Product Animation", "Beauty Industry", "Luxury Branding"]', NULL, NULL, 0, '2024-01-26 10:00:00', '2024-01-26 10:00:00'),

('cgi6', 'FLTR Media CGI', 'Creative CGI content for FLTR Media featuring dynamic visual effects, modern aesthetics, and engaging animation techniques for digital media campaigns.', 'https://youtube.com/watch?v=uqNTijKA6Ck', '3D/CGI', '["Cinema 4D", "Motion Graphics", "Digital Media", "Visual Effects", "Creative Direction"]', NULL, NULL, 0, '2024-01-27 10:00:00', '2024-01-27 10:00:00'),

('cgi7', 'Visioment Studios CGI Showcase', 'Professional CGI reel showcasing Visioment Studios\' capabilities in 3D visualization, animation, and visual effects for various industry applications.', 'https://youtube.com/watch?v=7H8BoGAMo0I', '3D/CGI', '["Blender", "Maya", "Studio Showcase", "Professional Reel", "Multi-Industry CGI"]', NULL, NULL, 0, '2024-01-28 10:00:00', '2024-01-28 10:00:00'),

('cgi8', 'Wells Fargo CGI', 'Corporate CGI animation for Wells Fargo featuring professional financial visualization, clean aesthetics, and corporate branding integration.', 'https://youtube.com/watch?v=NIPlk1FYDXs', '3D/CGI', '["Cinema 4D", "Corporate Animation", "Financial Services", "Brand Integration", "Professional CGI"]', NULL, NULL, 0, '2024-01-29 10:00:00', '2024-01-29 10:00:00');

-- Insert your real testimonials from portfolioData.ts
INSERT INTO testimonials (id, name, position, company, testimonial, image, rating, created_at, updated_at) VALUES
('test1', 'Mohammed Sheikh', 'Founder & Chief Executive Officer', 'Augment Africa Innovations', 'I''ve had the pleasure of working closely with Pratik, and I can confidently say they are one of the most talented and forward-thinking developers I''ve come across. Their technical expertise in augmented and virtual reality is truly impressive — from building immersive 3D environments to integrating seamless user experiences, Pratik consistently brings ideas to life in innovative and impactful ways.', NULL, 5, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

('test2', 'Pratikshita Chowdhury', 'Manager', '1M1B Foundation', 'I recommend Pratik for his role as an exceptional educator for the Creators of Metaverse program. His patience and attentiveness to learners create a positive training environment, and he manages sessions with a level of professionalism that is commendable. Pratik''s sessions have equipped both students and faculty to effectively utilize AR, 3D asset creation and animation tools.', NULL, 5, '2024-01-02 10:00:00', '2024-01-02 10:00:00'),

('test3', 'Dredann', 'Marketing Coordinator', 'Fairmont Château Laurier', 'Working with Pratik was great. The team had excellent communication and really ensured to understand our vision before moving forward with the project!', NULL, 5, '2024-01-03 10:00:00', '2024-01-03 10:00:00'),

('test4', 'Yoni Gal', 'Client', 'United Kingdom', 'Amazing guy, I had a complex task and he delivered above and beyond - truly great working with him on this and I''d highly recommend him - I''ll be working with him again - really great service and highly professional.', NULL, 5, '2024-01-04 10:00:00', '2024-01-04 10:00:00'),

('test5', 'Andrea Furtick', 'Client', 'United States', 'This was a wonderful experience. My Tiktok filter was made, just as I described, with precision and patience along the way. I can''t wait to work with this developer again!!!!!', NULL, 5, '2024-01-05 10:00:00', '2024-01-05 10:00:00'),

('test6', 'Digital Odella', 'Client', 'Mexico', 'Pratik delivered top-notch, PROFESSIONAL work and made the entire process a breeze with their quick responses and seamless collaboration. Truly a pleasure to work with—highly recommended!', NULL, 5, '2024-01-06 10:00:00', '2024-01-06 10:00:00'),

('test7', 'Karl Susman', 'Client', 'United States', 'Had a very specific job to do. Did an amazing job great communication stayed on top of everything. It will definitely be working together more.', NULL, 5, '2024-01-07 10:00:00', '2024-01-07 10:00:00'),

('test8', 'Badreya Alblooshi', 'Teacher Assistant', 'GEMS Education', 'I used Pratik''s help on my project, amazing work and very fast service🙏🏼', NULL, 5, '2024-01-08 10:00:00', '2024-01-08 10:00:00'),

('test9', 'Gopal Yadav', 'Research Scholar | PhD in Design', 'Indian Institute of Technology, Delhi', 'I highly recommend Pratik for his exceptional skills and dedication as an AR developer. His expertise in Unity and C# scripting, combined with a problem-solving mindset, makes him a valuable asset to any project.', NULL, 5, '2024-01-09 10:00:00', '2024-01-09 10:00:00'),

('test10', 'Samala Ritesh Dhyan', 'System Engineer', 'Tata Consultancy Services', 'I would like to thank Pratik for helping us out in developing an Augmented Reality application for us. He also explained the whole functionality of the application to us clearly. If any one requires any kind of technical support while developing AR or VR applications then i would highly recommend you all to reach out to him.😀', NULL, 5, '2024-01-10 10:00:00', '2024-01-10 10:00:00'),

('test11', 'Cheapgrav3l', 'Client', 'Netherlands', 'Nice to work with. Very proactive', NULL, 5, '2024-01-11 10:00:00', '2024-01-11 10:00:00'),

('test12', 'Antonio Furioso', '3D Configurators & AR Specialist', 'Colleague', 'Pratik has a very deep knowledge of Augmented Reality and Virtual Reality industry. Every time we meet he shows me something new that he''s doing and I like his ideas, and how he develops them. I think he is a good developer other than a good entrepreneur!', NULL, 5, '2024-01-12 10:00:00', '2024-01-12 10:00:00'),

('test13', 'Patience Ashiokai Ocquaye', 'Game Designer Tutor', 'Team Member', 'Pratik is a fantastic individual with creative ideas and a passion and drive to seek knowledge. He is very enthusiastic towards his projects and puts over 100% effort into finding the best and most efficient solution. He is talented across many mediums and a great asset to have on your team. He is very skilled in AR/VR applications, and I can''t wait to see what new innovative ideas he produces next.', NULL, 5, '2024-01-13 10:00:00', '2024-01-13 10:00:00'),

('test14', 'Dr. Kiran Wakchaure', 'Director of Projects', 'Sanjivani College of Engineering', 'Pratik Mane is an exceptionally hardworking and innovative individual with a strong proficiency in AR/VR technologies. His extensive experience includes numerous successful projects in this field. He demonstrates mastery in SparkAR, Blender, and Unity, making him a standout professional in the industry.', NULL, 5, '2024-01-14 10:00:00', '2024-01-14 10:00:00'),

('test15', 'Gurprem Singh', 'Freelance 3D Generalist | Blender & Unreal Developer', 'Team Member', 'Pratik is an absolute wizard when it comes to AR/VR! I''ve seen him bring wild ideas to life using Unity and Spark AR like it''s second nature. As the founder of Visioment Studios, he''s building experiences that actually wow people. What I admire is how effortlessly he mixes creativity with tech skills—always ahead of the curve and super fun to work with.', NULL, 5, '2024-01-15 10:00:00', '2024-01-15 10:00:00');

-- Add performance indexes
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
