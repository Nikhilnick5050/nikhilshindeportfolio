import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section, Flex } from '../components/ui/Layout';
import ButtonComponent from '../components/ui/Button';
import { VideoThumbnail } from '../components/ui/VideoThumbnail';
import { projectData } from '../utils/portfolioData';
import { Project } from '../types';
import { FaArrowLeft, FaPlay, FaExternalLinkAlt, FaVrCardboard, FaGamepad, FaCamera, FaCube } from 'react-icons/fa';
import { MdViewInAr } from 'react-icons/md';
import { SiCinema4D } from 'react-icons/si';
import { IconWrapper } from '../utils/IconWrapper';

const ProjectDetailSection = styled(Section)`
  padding-top: ${({ theme }) => theme.spacing.xl};
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

const ProjectDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectMedia = styled.div``;

const ProjectMainImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.animations.normal} ease;
  
  &:hover {
    opacity: 1;
  }
`;

const PlayButton = styled.a`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GalleryItem = styled.div`
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.animations.normal} ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const ProjectInfo = styled.div``;

const ProjectTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const CategoryBadge = styled.span<{ $category: 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ $category, theme }) => {
    switch ($category) {
      case 'AR':
        return `
          background-color: rgba(0, 217, 192, 0.2);
          color: ${theme.colors.accent};
        `;
      case 'VR':
        return `
          background-color: rgba(74, 0, 224, 0.2);
          color: ${theme.colors.primary};
        `; case 'AR Filters':
        return `
          background-color: rgba(255, 20, 147, 0.2);
          color: #ff1493;
        `;
      case 'Game Development':
        return `
          background-color: rgba(255, 165, 0, 0.2);
          color: #ff8c00;
        `;
      case '3D/CGI':
        return `
          background-color: rgba(128, 0, 128, 0.2);
          color: #8000ff;
        `;
      case 'Web Development':
        return `
          background-color: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        `;
      case 'Mobile App':
        return `
          background-color: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        `;
      default:
        return '';
    }
  }}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  }
`;

const ProjectDescription = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.8;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      line-height: 1.9;
    }
  }
`;

const TechTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TechTag = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
      button {
      width: 100%;
    }
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
`;

const getCategoryIcon = (category: 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App') => {
  switch (category) {
    case 'AR':
      return <IconWrapper icon={MdViewInAr} size={20} />;
    case 'VR':
      return <IconWrapper icon={FaVrCardboard} size={20} />;
    case 'AR Filters':
      return <IconWrapper icon={FaCamera} size={20} />;
    case 'Game Development':
      return <IconWrapper icon={FaGamepad} size={20} />;
    case '3D/CGI':
      return <IconWrapper icon={FaCube} size={20} />;
    case 'Web Development':
      return <IconWrapper icon={FaCube} size={20} />;
    case 'Mobile App':
      return <IconWrapper icon={FaCube} size={20} />;
    default:
      return null;
  }
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  // Find project by ID
  useEffect(() => {
    const foundProject = projectData.find(p => p.id === id);

    if (foundProject) {
      setProject(foundProject);
    }
  }, [id]);

  if (!project) {
    return (
      <NotFound>
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist or has been removed.</p>        <ButtonComponent variant="outline" onClick={() => navigate('/projects')}>
          Back to Projects
        </ButtonComponent>
      </NotFound>
    );
  }

  // Array of placeholder gallery images
  const galleryImages = project.galleryImages || [
    `https://via.placeholder.com/400x300?text=Gallery%20Image%201`,
    `https://via.placeholder.com/400x300?text=Gallery%20Image%202`,
    `https://via.placeholder.com/400x300?text=Gallery%20Image%203`,
    `https://via.placeholder.com/400x300?text=Gallery%20Image%204`,
    `https://via.placeholder.com/400x300?text=Gallery%20Image%205`,
    `https://via.placeholder.com/400x300?text=Gallery%20Image%206`,
  ];

  return (
    <ProjectDetailSection>
      <Container>
        <BackButton to="/projects">
          <IconWrapper icon={FaArrowLeft} /> Back to Projects
        </BackButton>

        <ProjectDetailGrid>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >            <ProjectMedia>
              <ProjectMainImage>
                <VideoThumbnail
                  videoUrl={project.videoUrl || ''}
                  alt={project.title}
                  fallbackImage={`https://via.placeholder.com/800x500?text=${encodeURIComponent(project.title)}`}
                />

                {project.videoUrl && (
                  <VideoOverlay>
                    <PlayButton href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                      <IconWrapper icon={FaPlay} />
                    </PlayButton>
                  </VideoOverlay>
                )}
              </ProjectMainImage>

              <GalleryGrid>
                {galleryImages.slice(0, 6).map((img, index) => (
                  <GalleryItem key={index}>
                    <img src={img} alt={`Gallery image ${index + 1}`} />
                  </GalleryItem>
                ))}
              </GalleryGrid>
            </ProjectMedia>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProjectInfo>
              <ProjectTitle>{project.title}</ProjectTitle>

              <CategoryBadge $category={project.category}>
                {getCategoryIcon(project.category)} {project.category} Project
              </CategoryBadge>

              <ProjectDescription>
                <p>{project.description}</p>                <p>
                  {project.category === 'AR' && 'This augmented reality project was developed to enhance user experience and interaction with the physical world. Using cutting-edge AR technology, it creates an immersive environment that overlays digital information onto the real world.'}
                  {project.category === 'VR' && 'This virtual reality experience transports users to a fully immersive digital environment. Using advanced VR technology, it creates a sense of presence and enables interactions that would be impossible in the real world.'}
                  {project.category === 'AR Filters' && 'This AR filter project creates engaging and interactive social media experiences. Using advanced face tracking and augmented reality technology, it delivers fun and shareable content for various platforms.'}
                  {project.category === 'Game Development' && 'This game development project showcases innovative gameplay mechanics and immersive experiences. Built with modern game development tools and techniques, it delivers engaging entertainment across multiple platforms.'}
                </p>
              </ProjectDescription>

              <TechTitle>Technologies Used</TechTitle>
              <TechGrid>
                {project.technologies.map((tech, index) => (
                  <TechTag key={index}>{tech}</TechTag>
                ))}
              </TechGrid>

              <ButtonGroup>
                {project.tryOutLink && (<ButtonComponent variant="primary" size="large" as="a" href={project.tryOutLink} target="_blank" rel="noopener noreferrer">
                  Try It Out
                </ButtonComponent>
                )}

                {project.projectUrl && (<ButtonComponent variant="outline" size="large" as="a" href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <IconWrapper icon={FaExternalLinkAlt} style={{ marginRight: '8px' }} /> Project Website
                </ButtonComponent>
                )}
              </ButtonGroup>
            </ProjectInfo>
          </motion.div>
        </ProjectDetailGrid>
      </Container>
    </ProjectDetailSection>
  );
};

export default ProjectDetailPage;
