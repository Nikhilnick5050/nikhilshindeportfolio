# Portfolio Admin Panel

## Overview
This admin panel allows you to manage your portfolio projects and testimonials through a user-friendly web interface. Built with PHP and MySQL, it provides full CRUD operations and seamless integration with your React frontend.

## Features
- 🔐 Secure email/password authentication
- 📁 Project management (Add, Edit, Delete)
- 💬 Testimonials management  
- 📸 Image upload for projects and testimonials
- 📊 Dashboard with statistics
- 🔄 Sync data with React application
- 📤 Export data functionality
- 🧹 File cleanup utilities
- 📱 Responsive design

## File Structure
```
admin/
├── config.php              # Configuration and database settings
├── database.sql            # Database schema
├── login.php               # Login page
├── dashboard.php           # Main dashboard
├── projects.php            # Projects management
├── testimonials.php        # Testimonials management
├── settings.php            # Admin settings
├── export.php              # Data export
├── sync_data.php           # Sync with React app
├── cleanup.php             # File cleanup utility
├── logout.php              # Logout handler
├── get_project.php         # API for project data
├── get_testimonial.php     # API for testimonial data
├── index.php               # Entry point
└── uploads/                # Uploaded files directory
    ├── projects/           # Project images
    └── testimonials/       # Testimonial images
```

## Database Schema
The admin panel uses MySQL with the following tables:
- `projects` - Store project information
- `testimonials` - Store client testimonials
- `admin_logs` - Track admin actions (optional)

## Security Features
- Password hashing with PHP's password_hash()
- Session management
- Input sanitization
- File upload validation
- SQL injection prevention with prepared statements

## Setup Instructions
See HOSTINGER_SETUP.md for detailed hosting setup instructions.

## Default Credentials
- Email: admin@pratikmane.com
- Password: your_secure_password

**Important:** Change these credentials in config.php before deployment!

## API Endpoints
- `get_project.php?id={id}` - Get project data
- `get_testimonial.php?id={id}` - Get testimonial data
- `sync_data.php` - Sync database with React app
- `export.php` - Export all data as JSON
- `cleanup.php` - Clean unused files
