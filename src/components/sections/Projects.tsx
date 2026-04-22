/* eslint-disable */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Container, Section, SectionTitle, SectionSubtitle, Flex } from '../ui/Layout';
import ButtonComponent from '../ui/Button';
import { VideoThumbnail } from '../ui/VideoThumbnail';
import { usePortfolio } from '../../context/PortfolioContext';
import { FaPlay, FaExternalLinkAlt, FaVrCardboard, FaTimes, FaGamepad, FaCamera, FaCube } from 'react-icons/fa';
import { MdViewInAr } from 'react-icons/md';
import { SiCinema4D } from 'react-icons/si';
import { IconWrapper } from '../../utils/IconWrapper';

type ProjectCategory = 'All' | 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App';

const ProjectsSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 10%, ${({ theme }) => theme.colors.primary}15 0%, transparent 50%);
    pointer-events: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.gradients.primary : 'rgba(20, 20, 20, 0.8)'};
  color: ${({ $isActive, theme }) =>
    $isActive ? '#000000' : theme.colors.text.secondary};
  border: ${({ $isActive, theme }) =>
    $isActive ? 'none' : `1px solid ${theme.colors.primary}40`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  font-family: 'Orbitron', sans-serif;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ $isActive, theme }) =>
    $isActive ? `0 5px 15px ${theme.colors.primary}70` : `0 5px 15px rgba(0, 0, 0, 0.3)`};
    color: ${({ $isActive, theme }) =>
    $isActive ? '#000000' : theme.colors.primary};
    border-color: ${({ $isActive, theme }) =>
    $isActive ? 'none' : theme.colors.primary};
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(40, 40, 40, 0.8);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6), 0 0 15px ${({ theme }) => theme.colors.primary}40;
    border-color: rgba(60, 60, 60, 0.8);
    
    &::after {
      transform: scaleX(1);
    }
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.animations.normal} ease;
  
  ${ProjectCard}:hover & {
    opacity: 1;
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
  flex-grow: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
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

const LoadMoreButton = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// Video Modal Styles
const VideoModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
    align-items: flex-start;
    padding-top: 1vh;
  }
`;

const VideoModalContent = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 1000px;
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  
  @media (max-width: 992px) {
    width: 95%;
    max-width: none;
    height: 90vh;
    max-height: none;
  }
  
  @media (max-width: 768px) {
    width: 98%;
    height: 95vh;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const VideoModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.card};
  flex-shrink: 0;
  min-height: 80px;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    min-height: 60px;
  }
`;

const VideoModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.animations.normal} ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background.card};
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  flex-grow: 1;
  background: #000;
  
  iframe, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  
  @media (max-width: 992px) {
    padding-bottom: 0;
    height: calc(100vh - 160px);
    min-height: 400px;
    
    iframe, video {
      position: static;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  @media (max-width: 768px) {
    height: calc(100vh - 120px);
    min-height: 300px;
    
    iframe, video {
      height: 100%;
    }
  }
`;

const PlayButton = styled.button`
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
  border: none;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.accent};
  }
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

const Projects: React.FC = () => {
  const { projects, loading, error } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  const handleCategoryChange = (category: ProjectCategory) => {
    setActiveCategory(category);
    setVisibleProjects(6);
  };

  const handleLoadMore = () => {
    setVisibleProjects(prev => prev + 3);
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const getEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('/shorts/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // For Cloudinary and other direct video URLs
    return url;
  };

  return (
    <ProjectsSection id="projects">
      <Container>
        <SectionTitle>My Projects</SectionTitle>
        <SectionSubtitle>
          For Every Role: Students, Faculty & Institutions
        </SectionSubtitle>
        <FilterContainer>
          <FilterButton
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
          </FilterButton>          <FilterButton
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
            Games
          </FilterButton>
          <FilterButton
            $isActive={activeCategory === '3D/CGI'}
            onClick={() => handleCategoryChange('3D/CGI')}
          >
            3D/CGI
          </FilterButton>        </FilterContainer>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ProjectsGrid ref={ref}>
            <AnimatePresence mode="wait">
              {filteredProjects
                .slice(0, visibleProjects)
                .map((project, index) => (
                  <ProjectCard
                    key={`${activeCategory}-${project.id}`}
                    layout
                    layoutId={project.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: "easeInOut",
                      layout: {
                        duration: 0.6,
                        ease: "easeInOut"
                      }
                    }}
                  >                  <ProjectThumbnail>                    <VideoThumbnail
                    videoUrl={project.videoUrl || ''}
                    alt={project.title}
                    fallbackImage={`https://placehold.co/400x200?text=${encodeURIComponent(project.title)}`}
                  />                    {project.videoUrl && (
                    <ProjectOverlay>
                      <PlayButton onClick={() => openVideoModal(project.videoUrl!, project.title)}>
                        <IconWrapper icon={FaPlay} />
                      </PlayButton>
                    </ProjectOverlay>
                  )}<CategoryBadge $category={project.category}>
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

                      <ProjectLinks>                      {project.tryOutLink && (
                        <ButtonComponent variant="primary" size="small" as="a" href={project.tryOutLink} target="_blank" rel="noopener noreferrer">
                          Try it Out
                        </ButtonComponent>
                      )}

                        {project.projectUrl && (
                          <ButtonComponent variant="outline" size="small" as="a" href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                            <IconWrapper icon={FaExternalLinkAlt} style={{ marginRight: '5px' }} /> Details
                          </ButtonComponent>
                        )}
                      </ProjectLinks>
                    </ProjectContent>
                  </ProjectCard>
                ))}          </AnimatePresence>
          </ProjectsGrid>

          {filteredProjects.length > 6 && (
            <LoadMoreButton>
              <ButtonComponent variant="outline" size="large" as={Link} to="/projects">
                View All Projects
              </ButtonComponent>
            </LoadMoreButton>
          )}
        </motion.div>
      </Container>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
          >
            <VideoModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <VideoModalHeader>
                <VideoModalTitle>{selectedVideo.title}</VideoModalTitle>
                <CloseButton onClick={closeVideoModal}>
                  <IconWrapper icon={FaTimes} />
                </CloseButton>
              </VideoModalHeader>
              <VideoContainer>
                {selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be') ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.url)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </VideoContainer>
            </VideoModalContent>
          </VideoModalOverlay>
        )}
      </AnimatePresence>
    </ProjectsSection>
  );
};

export default Projects;

