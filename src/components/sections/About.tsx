import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Container, Section, SectionTitle, SectionSubtitle, Flex } from '../ui/Layout';
import { educationData, profileData, skillsData } from '../../utils/portfolioData';
import { getSkillIcon } from '../../utils/skillIcons';
import ButtonComponent from '../ui/Button';
import { Skill as SkillType } from '../../types';
import resumePdf from '../../assets/Nikhil Shinde Resume.pdf';

const AboutSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  position: relative;
  overflow: hidden;
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const EducationSection = styled.div`
  grid-column: 1 / -1; /* Span across both columns */
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 2; /* Education comes second on mobile (after AboutContent) */
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const AboutContent = styled(motion.div)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 1; /* About text comes first on mobile */
  }
`;

const AboutText = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.8;
`;

const SkillsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 3; /* Skills come third on mobile (after AboutContent and Education) */
  }
`;

const SkillsRowContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const SkillsColumnContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SkillsGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SkillsCategoryTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const SkillItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: default;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.8;
    transition: all ${({ theme }) => theme.animations.fast} ease;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}10;
    border-color: ${({ theme }) => theme.colors.primary}50;
    transform: translateY(-2px);
    
    svg {
      opacity: 1;
    }
  }
`;

const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const EducationCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  transition: all ${({ theme }) => theme.animations.normal} ease;
`;

const EducationTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const EducationSubtitle = styled.h4`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const EducationDate = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const CenteredButton = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const About: React.FC = () => {
  const [refText, inViewText] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [refSkills, inViewSkills] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Function to download resume
  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = resumePdf;
    link.download = 'Nikhil_Shinde_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group skills by category
  const skillsByCategory = skillsData.reduce<Record<string, SkillType[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <AboutSection id="about">
      <Container>
        <SectionTitle>About Me</SectionTitle>
        <SectionSubtitle>
          Learn more about my skills and background in XR development
        </SectionSubtitle>        <AboutGrid>
          <AboutContent
            ref={refText}
            initial={{ opacity: 0, y: 50 }}
            animate={inViewText ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <AboutText>
              <p>
                {profileData.bio}
              </p>
              <p>
                As an XR Developer, I specialize in creating immersive experiences across augmented reality, virtual reality, and computer-generated imagery. My passion lies in bridging the gap between technology and human interaction through intuitive and captivating digital experiences.
              </p>

            </AboutText>
          </AboutContent>

          <SkillsContainer
            ref={refSkills}
            initial={{ opacity: 0, y: 50 }}
            animate={inViewSkills ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >            {/* Render Development and AR categories individually */}
            {['Development', 'AR'].map((category) => {
              const skills = skillsByCategory[category];
              if (!skills) return null;

              return (
                <SkillsGroup key={category}>
                  <SkillsCategoryTitle>{category}</SkillsCategoryTitle>
                  <SkillsList>
                    {skills.map((skill, index) => (
                      <SkillItem
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inViewSkills ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        {getSkillIcon(skill.name)}
                        {skill.name}
                      </SkillItem>
                    ))}
                  </SkillsList>
                </SkillsGroup>
              );
            })}
            {/* Render VR and CGI categories side by side */}
            <SkillsRowContainer>
              {['VR', 'CGI'].map((category) => {
                const skills = skillsByCategory[category];
                if (!skills) return null;

                return (
                  <SkillsColumnContainer key={category}>
                    <SkillsGroup>
                      <SkillsCategoryTitle>{category}</SkillsCategoryTitle>
                      <SkillsList>
                        {skills.map((skill, index) => (
                          <SkillItem
                            key={skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inViewSkills ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                          >
                            {skill.name}
                          </SkillItem>
                        ))}
                      </SkillsList>
                    </SkillsGroup>
                  </SkillsColumnContainer>
                );
              })}
            </SkillsRowContainer>
          </SkillsContainer>

          <EducationSection>
            <h3>Education</h3>
            <EducationGrid>
              {educationData.map((education, index) => (
                <EducationCard
                  key={education.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inViewText ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  <EducationTitle>{education.degree} in {education.field}</EducationTitle>
                  <EducationSubtitle>{education.institution}</EducationSubtitle>
                  <EducationDate>{education.startDate} - {education.endDate}</EducationDate>
                  {education.description && <p>{education.description}</p>}
                </EducationCard>
              ))}
            </EducationGrid>
          </EducationSection>
        </AboutGrid>

        <CenteredButton>          <ButtonComponent
          variant="outline"
          size="large"
          onClick={downloadResume}
        >
          Download My Resume
        </ButtonComponent>
        </CenteredButton>
      </Container>
    </AboutSection>
  );
};

export default About;
