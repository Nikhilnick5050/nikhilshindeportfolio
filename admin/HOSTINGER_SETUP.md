# Hostinger Setup Guide for Portfolio Admin Panel

## Prerequisites
- Hostinger hosting account (Business or Premium plan recommended)
- Domain name configured
- FTP/File Manager access
- MySQL database access

## Step 1: Prepare Your Files

### 1.1 Update Configuration
Before uploading, edit `admin/config.php`:

```php
// Database configuration
define('DB_HOST', 'localhost'); // Usually 'localhost' on Hostinger
define('DB_USER', 'your_hostinger_db_user');
define('DB_PASS', 'your_hostinger_db_password');
define('DB_NAME', 'your_hostinger_db_name');

// Admin credentials - CHANGE THESE!
define('ADMIN_EMAIL', 'your-admin@email.com');
define('ADMIN_PASSWORD', password_hash('your-strong-password', PASSWORD_DEFAULT));

// Site configuration
define('SITE_URL', 'https://your-domain.com');
define('ADMIN_URL', SITE_URL . '/admin');
```

### 1.2 Build Your React App
In your React project root:
```bash
npm run build
```

## Step 2: Set Up Database on Hostinger

### 2.1 Create Database
1. Log into Hostinger hPanel
2. Go to **Databases** → **MySQL Databases**
3. Click **Create Database**
4. Database name: `your_username_portfolio` (Hostinger adds prefix automatically)
5. Create a database user with full privileges
6. Note down the database name, username, and password

### 2.2 Import Database Schema
1. Go to **Databases** → **phpMyAdmin**
2. Select your database
3. Go to **Import** tab
4. Upload the `admin/database.sql` file
5. Click **Go** to execute

Alternative via SQL tab:
```sql
-- Copy and paste the contents of database.sql here
```

## Step 3: Upload Files to Hostinger

### 3.1 File Structure on Server
Your domain's public_html should look like:
```
public_html/
├── index.html                    # React build files
├── static/                       # React static assets
├── assets/                       # React assets
├── manifest.json
├── robots.txt
├── favicon.ico
├── admin/                        # Admin panel
│   ├── config.php
│   ├── login.php
│   ├── dashboard.php
│   ├── ... (all admin files)
│   └── uploads/                  # Create this directory
│       ├── projects/
│       └── testimonials/
└── ... (other React build files)
```

### 3.2 Upload via File Manager
1. Go to **Hosting** → **File Manager**
2. Navigate to `public_html`
3. Upload your React build files to the root
4. Create `admin` folder
5. Upload all admin PHP files to the `admin` folder
6. Create `uploads` folder inside `admin`
7. Create `projects` and `testimonials` folders inside `uploads`

### 3.3 Upload via FTP
Use FileZilla or similar:
- Host: your-domain.com
- Username: your FTP username
- Password: your FTP password
- Port: 21

## Step 4: Set File Permissions

### 4.1 Required Permissions
Set the following permissions via File Manager:
- `admin/uploads/` → 755
- `admin/uploads/projects/` → 755  
- `admin/uploads/testimonials/` → 755
- All PHP files → 644

### 4.2 Via File Manager
1. Right-click on folder/file
2. Select **Permissions**
3. Set appropriate permissions
4. Check "Apply to subdirectories" for folders

## Step 5: Test Your Setup

### 5.1 Test Database Connection
Create a test file `admin/test_db.php`:
```php
<?php
require_once 'config.php';
try {
    $pdo = getDBConnection();
    echo "Database connection successful!";
} catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage();
}
?>
```

Visit: `https://your-domain.com/admin/test_db.php`

### 5.2 Test Admin Panel
1. Visit: `https://your-domain.com/admin/`
2. Should redirect to login page
3. Login with your admin credentials
4. Check if dashboard loads properly

### 5.3 Test File Uploads
1. Try adding a new project with an image
2. Check if file uploads to `admin/uploads/projects/`
3. Verify image displays correctly

## Step 6: Configure Hostinger Specific Settings

### 6.1 PHP Settings
Check your PHP version in hPanel:
- Go to **Advanced** → **PHP Configuration**
- Recommended: PHP 8.0 or higher
- Ensure these extensions are enabled:
  - PDO
  - PDO_MySQL
  - GD (for image handling)
  - JSON

### 6.2 Error Reporting
For production, add to your PHP files:
```php
error_reporting(0);
ini_set('display_errors', 0);
```

For debugging, use:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Step 7: Security Hardening

### 7.1 Protect Admin Directory
Create `.htaccess` in `admin/` folder:
```apache
# Deny access to sensitive files
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>

<Files "database.sql">
    Order Allow,Deny
    Deny from all
</Files>

# Optional: IP restriction (replace with your IP)
# <RequireAll>
#     Require ip 192.168.1.100
# </RequireAll>
```

### 7.2 Secure File Uploads
Ensure `uploads/` has this `.htaccess`:
```apache
# Prevent execution of PHP files
<Files "*.php">
    Order Allow,Deny
    Deny from all
</Files>

# Only allow specific file types
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>
```

## Step 8: SSL Configuration

### 8.1 Enable SSL
1. Go to **Security** → **SSL/TLS**
2. Select **Let's Encrypt**
3. Enable SSL for your domain
4. Force HTTPS redirect

### 8.2 Update URLs
Ensure all URLs in your config use `https://`

## Step 9: Backup Setup

### 9.1 Database Backup
Set up automatic backups:
1. Go to **Databases** → **Backups**
2. Schedule daily backups
3. Download backup files regularly

### 9.2 File Backup
1. Go to **Files** → **Backups**
2. Create full website backup
3. Download and store securely

## Step 10: Monitoring and Maintenance

### 10.1 Error Logs
Check PHP error logs:
1. Go to **Advanced** → **Error Logs**
2. Monitor for any issues
3. Address errors promptly

### 10.2 Resource Usage
Monitor in hPanel:
- CPU usage
- Memory usage
- Disk space
- Database size

## Troubleshooting Common Issues

### Database Connection Issues
- Verify database credentials in config.php
- Check if database exists and user has permissions
- Ensure database server is running

### File Upload Issues
- Check directory permissions (755 for directories, 644 for files)
- Verify PHP upload limits
- Check available disk space

### Permission Errors
```bash
# Set correct permissions
chmod 755 admin/uploads/
chmod 755 admin/uploads/projects/
chmod 755 admin/uploads/testimonials/
```

### Session Issues
- Ensure sessions are enabled in PHP
- Check session save path permissions
- Clear browser cache/cookies

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] Admin login working
- [ ] File uploads working
- [ ] SSL certificate active
- [ ] Backups configured
- [ ] Error logs checked
- [ ] Security measures implemented
- [ ] Performance optimized

## Support Resources

- **Hostinger Knowledge Base**: https://support.hostinger.com
- **PHP Documentation**: https://php.net/docs.php
- **MySQL Documentation**: https://dev.mysql.com/doc/

## Additional Tips

1. **Performance**: Enable caching in hPanel for better performance
2. **CDN**: Consider using Cloudflare for better speed
3. **Monitoring**: Set up uptime monitoring
4. **Updates**: Keep PHP and dependencies updated
5. **Security**: Regular security scans and updates

Remember to change default passwords and keep your admin credentials secure!
