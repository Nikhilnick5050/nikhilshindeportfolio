import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AchievementsSection = styled.section`
  padding: 100px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  text-align: center;
  margin-bottom: 50px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.card};
  padding: 30px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardDesc = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyStateNote = styled.p`
  margin-top: 28px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Achievements = () => {
  const placeholders = [
    'Building real-world projects (Classgrid)',
    'Actively learning web development & AI',
    'Exploring SaaS product development',
  ];

  return (
    <AchievementsSection id="achievements">
      <div className="container">
        <Title>Achievements</Title>
        <Grid>
          {placeholders.map((text) => (
            <Card key={text} whileHover={{ y: -5 }}>
              <CardTitle>In Progress</CardTitle>
              <CardDesc>{text}</CardDesc>
            </Card>
          ))}
        </Grid>
        <EmptyStateNote>More achievements coming soon.</EmptyStateNote>
      </div>
    </AchievementsSection>
  );
};

export default Achievements;
