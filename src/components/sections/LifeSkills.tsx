import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: 50px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const SkillCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.card};
  padding: 30px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

const SkillTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 15px;
`;

const SkillDesc = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LifeSkills: React.FC = () => {
  return (
    <Section id="life-skills">
      <Title>Life Skills</Title>
      <Grid>
        <SkillCard whileHover={{ y: -5 }}>
          <SkillTitle>Problem Solving</SkillTitle>
          <SkillDesc>Adept at analyzing complex problems and creating efficient, step-by-step solutions.</SkillDesc>
        </SkillCard>
        <SkillCard whileHover={{ y: -5 }}>
          <SkillTitle>Adaptability</SkillTitle>
          <SkillDesc>Quick to learn new tools and frameworks within changing tech landscapes.</SkillDesc>
        </SkillCard>
        <SkillCard whileHover={{ y: -5 }}>
          <SkillTitle>Communication</SkillTitle>
          <SkillDesc>Effective at conveying technical concepts and collaborating within a team.</SkillDesc>
        </SkillCard>
      </Grid>
    </Section>
  );
};

export default LifeSkills;
