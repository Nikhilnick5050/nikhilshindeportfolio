# 🚀 Quick Email Setup Guide

## Step-by-Step Configuration

### 1. EmailJS Setup (5 minutes)
1. **Sign up**: Go to [EmailJS.com](https://www.emailjs.com/) and create account
2. **Add Service**: Dashboard → Email Services → Add New Service → Choose Gmail
3. **Gmail Setup**: 
   - Email: your-email@gmail.com
   - Password: Create App Password (Gmail Settings → Security → App passwords)
4. **Copy Service ID**: Something like `service_abc123`

### 2. Create Template
1. **Template**: Dashboard → Email Templates → Create New Template
2. **Subject**: `New Contact from {{from_name}} - {{subject}}`
3. **Content**:
```
Hi Pratik,

New message from portfolio:

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
From your portfolio website
```
4. **Copy Template ID**: Something like `template_xyz789`

### 3. Get Public Key
1. **Account**: Dashboard → Account → General
2. **Copy Public Key**: Something like `user_abcdef123`

### 4. Update Code
Open `src/services/emailService.ts` and replace:
```typescript
const EMAILJS_SERVICE_ID = 'service_abc123'; // Your service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'; // Your template ID  
const EMAILJS_PUBLIC_KEY = 'user_abcdef123'; // Your public key
```

### 5. Test
1. Run your portfolio: `npm start`
2. Go to contact form
3. Send a test message
4. Check your email!

## ⚡ Quick Test
Fill out contact form with:
- Name: Test User
- Email: test@example.com  
- Subject: Test Message
- Message: Testing email functionality

You should receive the email within seconds!

## 🔧 Troubleshooting
- **No email received**: Check spam folder
- **Error in console**: Verify all IDs are correct
- **Gmail issues**: Make sure you used App Password, not regular password
- **Rate limits**: EmailJS free plan has 200 emails/month

## 💡 Pro Tips
- Test with different email addresses
- Customize the template to match your brand
- Add email validation rules if needed
- Consider adding reCAPTCHA for spam protection

## 📊 Current Setup Status
✅ Email service integration complete  
✅ Contact form ready  
✅ Error handling implemented  
✅ Loading states added  
⏳ **Waiting for EmailJS configuration**

Once you add your EmailJS credentials, the contact form will be fully functional!
