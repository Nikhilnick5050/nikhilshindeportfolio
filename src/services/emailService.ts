const FORMSPREE_ENDPOINT = (
  process.env.REACT_APP_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xeevljno'
).trim();

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

export const sendEmail = async (formData: ContactFormData): Promise<EmailResponse> => {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Portfolio Contact',
        message: formData.message,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
      };
    }

    const errorData = await response.json().catch(() => null);
    const firstError = errorData?.errors?.[0]?.message;
    throw new Error(firstError || 'Failed to send message');
  } catch (error) {
    console.error('Formspree error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send message. Please try again later.',
    };
  }
};

// Alternative: Netlify Forms (if deploying on Netlify)
export const sendNetlifyForm = async (formData: ContactFormData): Promise<EmailResponse> => {
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': 'contact',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }).toString(),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
      };
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Netlify form error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again or contact me directly.',
    };
  }
};
