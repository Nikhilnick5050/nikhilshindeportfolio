import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Container, Section, SectionTitle, SectionSubtitle } from '../ui/Layout';
import ButtonComponent from '../ui/Button';
import { contactData } from '../../utils/portfolioData';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaSpinner } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { sendEmail, ContactFormData } from '../../services/emailService';

const ContactSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  position: relative;
  overflow: hidden;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ContactForm = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.background.card};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SocialTitle = styled.h4`
  margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SocialIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2rem;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-5px);
  }
`;

const FormTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: 'Rajdhani', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: 'Rajdhani', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.base};
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const FormButton = styled(ButtonComponent)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const MessageStatus = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'success',
})<{ success?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ success, theme }) =>
    success ? theme.colors.ui.success : theme.colors.ui.error};
  background: ${({ success, theme }) =>
    success ? theme.colors.ui.success + '20' : theme.colors.ui.error + '20'};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [status, setStatus] = useState<{
    success?: boolean;
    message: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [refInfo, inViewInfo] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const [refForm, inViewForm] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous status when user starts typing
    if (status) {
      setStatus(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        success: false,
        message: 'Please fill in all required fields',
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        success: false,
        message: 'Please enter a valid email address',
      });
      return;
    }
    
    setIsLoading(true);
    setStatus(null);
    
    try {
      // Send email through Formspree
      const result = await sendEmail(formData);
      
      setStatus({
        success: result.success,
        message: result.message,
      });
      
      // Reset form only if successful
      if (result.success) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        
        // Clear success message after 8 seconds
        setTimeout(() => {
          setStatus(null);
        }, 8000);
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'An unexpected error occurred. Please try again or contact me directly.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ContactSection id="contact">
      <Container>
        <SectionTitle>Get In Touch</SectionTitle>
        <SectionSubtitle>
          Have a project in mind or want to work together? Reach out to me.
        </SectionSubtitle>
        
        <ContactGrid>
          <ContactInfo
            ref={refInfo}
            initial={{ opacity: 0, x: -50 }}
            animate={inViewInfo ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <InfoItem>
              <InfoIcon>
                <IconWrapper icon={FaEnvelope} />
              </InfoIcon>
              <InfoContent>
                <InfoTitle>Email</InfoTitle>
                <InfoText>
                  <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
                </InfoText>
              </InfoContent>
            </InfoItem>
            
            {contactData.phone && (
              <InfoItem>
                <InfoIcon>
                  <IconWrapper icon={FaPhone} />
                </InfoIcon>
                <InfoContent>
                  <InfoTitle>Phone</InfoTitle>
                  <InfoText>
                    <a href={`tel:${contactData.phone}`}>{contactData.phone}</a>
                  </InfoText>
                </InfoContent>
              </InfoItem>
            )}
            
            {contactData.address && (
              <InfoItem>
                <InfoIcon>
                  <IconWrapper icon={FaMapMarkerAlt} />
                </InfoIcon>
                <InfoContent>
                  <InfoTitle>Location</InfoTitle>
                  <InfoText>{contactData.address}</InfoText>
                </InfoContent>
              </InfoItem>
            )}
            
            <SocialTitle>Follow Me On</SocialTitle>
            <SocialIcons>
              {contactData.socialMedia.linkedin && (
                <SocialIcon href={contactData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                  <IconWrapper icon={FaLinkedin} />
                </SocialIcon>
              )}
              
              {contactData.socialMedia.github && (
                <SocialIcon href={contactData.socialMedia.github} target="_blank" rel="noopener noreferrer">
                  <IconWrapper icon={FaGithub} />
                </SocialIcon>
              )}
              
              {contactData.socialMedia.twitter && (
                <SocialIcon href={contactData.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  <IconWrapper icon={FaTwitter} />
                </SocialIcon>
              )}
              
              {contactData.socialMedia.instagram && (
                <SocialIcon href={contactData.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  <IconWrapper icon={FaInstagram} />
                </SocialIcon>
              )}
            </SocialIcons>
          </ContactInfo>
          
          <ContactForm
            ref={refForm}
            initial={{ opacity: 0, x: 50 }}
            animate={inViewForm ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <FormTitle>Send Me a Message</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Name*</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">Email*</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <FormInput
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Message*</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                />
              </FormGroup>
                <FormButton 
                variant="primary" 
                size="large" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IconWrapper icon={FaSpinner} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </FormButton>
              
              {status && (
                <MessageStatus success={status.success}>
                  {status.message}
                </MessageStatus>
              )}
            </form>
          </ContactForm>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;
