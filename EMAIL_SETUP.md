# Email Setup Instructions for Portfolio

## Option 1: EmailJS Setup (Recommended)

EmailJS allows you to send emails directly from your React application without a backend server.

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Copy the **Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to "Email Templates" in dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact from {{from_name}} - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save the template and copy the **Template ID**

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### Step 5: Update Configuration
Open `src/services/emailService.ts` and replace these values:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID = 'your_template_id_here'; 
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
```

### Example Configuration:
```typescript
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_PUBLIC_KEY = 'user_def456';
```

## Option 2: Netlify Forms (If deploying to Netlify)

If you're deploying to Netlify, you can use Netlify Forms instead:

### Step 1: Add to Contact Form
Add this hidden input to your form in Contact.tsx:

```jsx
<form onSubmit={handleSubmit} data-netlify="true" name="contact">
  <input type="hidden" name="form-name" value="contact" />
  {/* ... rest of your form */}
</form>
```

### Step 2: Update Email Service
In `src/services/emailService.ts`, use `sendNetlifyForm` instead of `sendEmail`.

## Option 3: Custom Backend

For a more robust solution, create your own backend API:

### Node.js + Express + Nodemailer
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    await transporter.sendMail({
      from: email,
      to: 'your-email@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.listen(3001);
```

## Testing

After setup, test your contact form:
1. Fill out all required fields
2. Submit the form
3. Check your email for the message
4. Verify the success/error messages work

## Troubleshooting

### EmailJS Issues:
- **401 Unauthorized**: Check your Public Key
- **Template not found**: Verify Template ID
- **Service not found**: Verify Service ID
- **Blocked by CORS**: EmailJS should handle this automatically

### Rate Limiting:
- EmailJS free plan: 200 emails/month
- For production, consider upgrading or implementing rate limiting

### Security:
- Never expose private keys in frontend code
- EmailJS public keys are safe to use in frontend
- Consider adding reCAPTCHA for spam protection

## Environment Variables (Optional)

For better security, you can use environment variables:

Create `.env` file:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id  
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Update `emailService.ts`:
```typescript
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;
```

Remember to add `.env` to your `.gitignore` file!
