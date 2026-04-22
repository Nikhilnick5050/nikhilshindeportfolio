import React from 'react';
import styled from 'styled-components';
import { Container, Section, SectionTitle, SectionSubtitle } from '../components/ui/Layout';

const PageWrapper = styled(Section)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const CardText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const IntegrationSection = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const LogoImage = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 20px;
  object-fit: cover;
`;

const IntegrationTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const IntegrationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

const StatusPill = styled.span<{ $connected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme, $connected }) =>
    $connected ? theme.colors.ui.success : theme.colors.ui.error};
  color: ${({ theme, $connected }) =>
    $connected ? theme.colors.ui.success : theme.colors.ui.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const EndpointLink = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  word-break: break-all;
`;

const LifeSkillsPage: React.FC = () => {
  const skills = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership'];
  const supabaseImage =
    'https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/classroom-files/logo/apple-touch-icon.png';
  const formspreeEndpoint =
    process.env.REACT_APP_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xeevljno';
  const chatApiEndpoint = (process.env.REACT_APP_CHAT_API_URL || '/api/chat').trim();
  const hasGroq = Boolean(chatApiEndpoint);
  const hasFormspree = Boolean(formspreeEndpoint);

  return (
    <PageWrapper>
      <Container>
        <SectionTitle>Life Skills</SectionTitle>
        <SectionSubtitle>
          Core strengths that support real-world execution, collaboration, and product building.
        </SectionSubtitle>

        <Grid>
          {skills.map((skill) => (
            <Card key={skill}>
              <CardTitle>{skill}</CardTitle>
              <CardText>{skill} is actively applied in Classgrid and portfolio projects.</CardText>
            </Card>
          ))}
        </Grid>

        <IntegrationSection>
          <LogoImage src={supabaseImage} alt="Classgrid logo from Supabase" />
          <div>
            <IntegrationTitle>Supabase Image + API Connections</IntegrationTitle>
            <IntegrationText>
              Classgrid logo is loaded from a Supabase storage link. This portfolio is connected with
              Groq API for AI chat and Formspree for contact form submissions.
            </IntegrationText>
            <StatusRow>
              <StatusPill $connected={hasGroq}>Groq API: {hasGroq ? 'Connected' : 'Not Configured'}</StatusPill>
              <StatusPill $connected={hasFormspree}>
                Formspree: {hasFormspree ? 'Connected' : 'Not Configured'}
              </StatusPill>
            </StatusRow>
            <IntegrationText style={{ marginTop: '12px' }}>
              Form endpoint:{' '}
              <EndpointLink href={formspreeEndpoint} target="_blank" rel="noopener noreferrer">
                {formspreeEndpoint}
              </EndpointLink>
            </IntegrationText>
          </div>
        </IntegrationSection>
      </Container>
    </PageWrapper>
  );
};

export default LifeSkillsPage;
