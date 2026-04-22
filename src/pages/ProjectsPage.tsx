import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';
import { Container, Section, SectionTitle, SectionSubtitle } from '../components/ui/Layout';
import ButtonComponent from '../components/ui/Button';
import { VideoThumbnail } from '../components/ui/VideoThumbnail';
import { projectData } from '../utils/portfolioData';
import { Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlay, FaExternalLinkAlt, FaVrCardboard, FaGamepad, FaCamera, FaCube } from 'react-icons/fa';
import { MdViewInAr } from 'react-icons/md';
import { SiCinema4D } from 'react-icons/si';
import { IconWrapper } from '../utils/IconWrapper';

type ProjectCategory = 'All' | 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App';

const ProjectsPageWrapper = styled(Section)`
  min-height: 70vh;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.gradients.primary : theme.colors.background.card};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  font-family: 'Orbitron', sans-serif;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  transition: transform ${({ theme }) => theme.animations.normal} ease,
              box-shadow ${({ theme }) => theme.animations.normal} ease;
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const ProjectThumbnail = styled.div`
  height: 160px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.animations.normal} ease;
  }
  
  ${ProjectCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.animations.normal} ease;
  
  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.a`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const CategoryBadge = styled.span<{ $category: 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App' }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
    ${({ $category, theme }) => {
    switch ($category) {
      case 'AR':
        return `
          background-color: rgba(0, 217, 192, 0.9);
          color: #052e2a;
        `;
      case 'VR':
        return `
          background-color: rgba(74, 0, 224, 0.9);
          color: white;
        `;
      case 'AR Filters':
        return `
          background-color: rgba(255, 20, 147, 0.9);
          color: white;
        `;
      case 'Game Development':
        return `
          background-color: rgba(255, 165, 0, 0.9);
          color: #000000;
        `;
      case '3D/CGI':
        return `
          background-color: rgba(128, 0, 128, 0.9);
          color: white;
        `;
      case 'Web Development':
        return `
          background-color: rgba(59, 130, 246, 0.9);
          color: white;
        `;
      case 'Mobile App':
        return `
          background-color: rgba(34, 197, 94, 0.9);
          color: white;
        `;
      default:
        return '';
    }
  }}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const ProjectContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 240px;
`;

const ProjectTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    line-height: 1.4;
  }
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 80px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.6;
    -webkit-line-clamp: 5;
    min-height: 100px;
  }
`;

const ProjectTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
  min-height: 32px;
`;

const TechTag = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:first-child {
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.accent};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
  
  &:hover {
    transform: translateX(-5px);
  }
  
  transition: transform ${({ theme }) => theme.animations.fast} ease;
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const NoResultsText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const getCategoryIcon = (category: 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App') => {
  switch (category) {
    case 'AR':
      return <IconWrapper icon={MdViewInAr} />;
    case 'VR':
      return <IconWrapper icon={FaVrCardboard} />;
    case 'AR Filters':
      return <IconWrapper icon={FaCamera} />;
    case 'Game Development':
      return <IconWrapper icon={FaGamepad} />;
    case '3D/CGI':
      return <IconWrapper icon={FaCube} />;
    case 'Web Development':
      return <IconWrapper icon={FaCube} />;
    case 'Mobile App':
      return <IconWrapper icon={FaCube} />;
    default:
      return null;
  }
};

const ProjectsPage: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectData);

  useEffect(() => {
    // Get category from query params if it exists
    const params = new URLSearchParams(location.search);
    const category = params.get('category') as ProjectCategory | null;

    if (category && ['AR', 'VR', 'CGI'].includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory('All');
    }
  }, [location.search]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProjects(projectData);
    } else {
      setFilteredProjects(projectData.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);

  const handleCategoryChange = (category: ProjectCategory) => {
    setActiveCategory(category);
  };

  return (
    <ProjectsPageWrapper>
      <Container>
        <BackButton to="/">
          <IconWrapper icon={FaArrowLeft} /> Back to Home
        </BackButton>
        <SectionTitle>All Projects</SectionTitle>
        <SectionSubtitle>
          Browse my complete portfolio of XR and immersive projects
        </SectionSubtitle>
        <FilterContainer>          <FilterButton
          $isActive={activeCategory === 'All'}
          onClick={() => handleCategoryChange('All')}
        >
          All Projects
        </FilterButton>
          <FilterButton
            $isActive={activeCategory === 'AR'}
            onClick={() => handleCategoryChange('AR')}
          >
            AR Projects
          </FilterButton>
          <FilterButton
            $isActive={activeCategory === 'VR'}
            onClick={() => handleCategoryChange('VR')}
          >
            VR Projects
          </FilterButton>
          <FilterButton
            $isActive={activeCategory === 'AR Filters'}
            onClick={() => handleCategoryChange('AR Filters')}
          >
            AR Filters
          </FilterButton>
          <FilterButton
            $isActive={activeCategory === 'Game Development'}
            onClick={() => handleCategoryChange('Game Development')}
          >
            Game Development
          </FilterButton>
        </FilterContainer>
        {filteredProjects.length > 0 ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectsGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  ><ProjectThumbnail>
                      <VideoThumbnail
                        videoUrl={project.videoUrl || ''}
                        alt={project.title}
                        fallbackImage={`https://via.placeholder.com/400x200?text=${encodeURIComponent(project.title)}`}
                      />
                      {project.videoUrl && (
                        <ProjectOverlay>
                          <PlayButton href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                            <IconWrapper icon={FaPlay} />
                          </PlayButton>
                        </ProjectOverlay>
                      )}
                      <CategoryBadge $category={project.category}>
                        {getCategoryIcon(project.category)} {project.category}
                      </CategoryBadge>
                    </ProjectThumbnail>

                    <ProjectContent>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectDescription>{project.description}</ProjectDescription>
                      <ProjectTech>
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <TechTag key={i}>{tech}</TechTag>
                        ))}
                        {project.technologies.length > 3 && <TechTag>+{project.technologies.length - 3} more</TechTag>}
                      </ProjectTech>

                      <ProjectLinks>
                        {project.tryOutLink && (<ButtonComponent variant="primary" size="small" as="a" href={project.tryOutLink} target="_blank" rel="noopener noreferrer">
                          Try it Out
                        </ButtonComponent>
                        )}
                        <ButtonComponent variant="outline" size="small" as={Link} to={`/project/${project.id}`}>
                          View Details
                        </ButtonComponent>                  </ProjectLinks>
                    </ProjectContent>
                  </ProjectCard>
                ))}
              </AnimatePresence>
            </ProjectsGrid>
          </motion.div>
        ) : (<NoResults>
          <NoResultsText>No projects found for this category.</NoResultsText>
          <ButtonComponent variant="primary" onClick={() => handleCategoryChange('All')}>
            View All Projects
          </ButtonComponent>
        </NoResults>
        )}
      </Container>
    </ProjectsPageWrapper>
  );
};

export default ProjectsPage;
