import React from 'react';
import styled from 'styled-components';
import { Container } from '../ui/Layout';
import { contactData, profileData } from '../../utils/portfolioData';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.gradients.primary};
  }
`;

const FooterContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 30px;
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: color ${({ theme }) => theme.animations.fast} ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;


const Copyright = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Logo = styled(Link)`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin: 0;
    background: ${({ theme }) => theme.colors.gradients.primary};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  span {
    color: ${({ theme }) => theme.colors.accent};
    margin-left: 2px;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterColumn>
          <Logo to="/">
            <h2>{profileData.name.split(' ')[0]}<span>.</span></h2>
          </Logo>
          <FooterText>
            Developer & Creator of Classgrid, Computer Engineering student building scalable web applications and real-world tech solutions.
          </FooterText>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Navigation</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/#about">About</FooterLink>
          <FooterLink to="/#achievements">Achievements</FooterLink>
          <FooterLink to="/#projects">Projects</FooterLink>
          <FooterLink to="/life-skills">Life Skills</FooterLink>
          <FooterLink to="/#contact">Contact</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Projects</FooterTitle>
          <FooterLink to="/projects?category=Web">Web Projects</FooterLink>
          <FooterLink to="/projects?category=SaaS">SaaS Projects</FooterLink>
          
          <FooterLink to="/projects">All Projects</FooterLink>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Contact</FooterTitle>
          <FooterText>{contactData.email}</FooterText>
          {contactData.phone && <FooterText>{contactData.phone}</FooterText>}
          {contactData.address && <FooterText>{contactData.address}</FooterText>}
        </FooterColumn>
      </FooterContainer>
      
      <Container>
        <Copyright>
          <p>&copy; {new Date().getFullYear()} {profileData.name}. All Rights Reserved.</p>
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
