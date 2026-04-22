# Final Setup Guide for Pratik Portfolio Admin Panel

## 🔧 **Step-by-Step Database Fix**

### Option 1: Fresh Installation (Recommended if you don't have important data)

1. **Go to phpMyAdmin** on your Hostinger hosting panel
2. **Select your database** (usually `u123456789_pratikdb` or similar)
3. **Go to SQL tab**
4. **Copy and paste the ENTIRE content** from `database_final.sql`
5. **Click "Go"** to execute

### Option 2: Migrate Existing Data (If you have data to preserve)

1. **Go to phpMyAdmin** on your Hostinger hosting panel
2. **Select your database**
3. **Go to SQL tab**
4. **Copy and paste the ENTIRE content** from `migration.sql`
5. **Click "Go"** to execute

---

## 🔑 **Update Your Config Files**

### 1. Update `admin/config.php`

Replace the placeholder values with your actual credentials:

```php
// Database configuration - UPDATE THESE!
define('DB_HOST', 'localhost');
define('DB_USER', 'u123456789_pratik');          // Your actual DB username
define('DB_PASS', 'YourActualPassword123');       // Your actual DB password
define('DB_NAME', 'u123456789_pratikdb');         // Your actual DB name

// Admin credentials - CHANGE THESE!
define('ADMIN_EMAIL', 'your@email.com');
define('ADMIN_PASSWORD', password_hash('YourSecurePassword123', PASSWORD_DEFAULT));

// Site configuration - UPDATE YOUR DOMAIN!
define('SITE_URL', 'https://yourdomain.com');
```

### 2. Update your React `.env` file

```env
REACT_APP_ADMIN_API_URL=https://yourdomain.com/admin/api.php
REACT_APP_ADMIN_API_ENABLED=true
```

---

## 🧪 **Test Your Setup**

### Step 1: Test Database Connection

1. **Visit:** `https://yourdomain.com/admin/test.php`
2. **Should show:** Database connection successful and table information

### Step 2: Test Admin Login

1. **Visit:** `https://yourdomain.com/admin/login.php`
2. **Login with:**
   - Username: `admin`
   - Password: `admin123`
3. **Should redirect to:** Admin dashboard

### Step 3: Test API Endpoints

1. **Visit:** `https://yourdomain.com/admin/api.php?endpoint=projects`
2. **Should return:** JSON array of projects
3. **Visit:** `https://yourdomain.com/admin/api.php?endpoint=testimonials`
4. **Should return:** JSON array of testimonials

### Step 4: Test CRUD Operations

1. **Go to:** `https://yourdomain.com/admin/projects.php`
2. **Try adding a new project**
3. **Try editing an existing project**
4. **Try deleting a test project**

---

## 🔄 **React Frontend Integration**

Your React app will automatically fetch data from the admin panel if:

1. ✅ **Admin API is enabled** (`REACT_APP_ADMIN_API_ENABLED=true`)
2. ✅ **API URL is correct** in `.env`
3. ✅ **Database tables exist** with correct structure
4. ✅ **CORS headers** are properly set (already done in `api.php`)

---

## 🚨 **Common Issues & Solutions**

### ❌ "Unknown column 'testimonial'" Error
**Solution:** Run the `migration.sql` script to fix column names

### ❌ "Access denied for user" Error  
**Solution:** Check your DB credentials in `config.php`

### ❌ "Table doesn't exist" Error
**Solution:** Run either `database_final.sql` or `migration.sql`

### ❌ "Cannot login to admin panel"
**Solution:** The default login is username:`admin`, password:`admin123`

### ❌ "CORS error in React app"
**Solution:** Ensure your `api.php` has proper CORS headers (already included)

---

## 🔒 **Security Checklist**

After everything works:

1. ✅ **Change default admin password** in database
2. ✅ **Update ADMIN_PASSWORD** in `config.php`
3. ✅ **Delete** `install.php` file
4. ✅ **Set folder permissions** to 755 for admin folder
5. ✅ **Set file permissions** to 644 for PHP files

---

## 📱 **Final Verification**

1. **Admin Panel:** All CRUD operations work
2. **React App:** Displays dynamic data from admin
3. **API:** Returns proper JSON responses
4. **Security:** Default credentials changed
5. **Performance:** Database indexes created

**🎉 Your portfolio admin panel is now fully functional!**
