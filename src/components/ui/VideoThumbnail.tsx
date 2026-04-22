import React from 'react';
import styled from 'styled-components';
import { useVideoThumbnail } from '../../hooks/useVideoThumbnail';

interface VideoThumbnailProps {
  videoUrl: string;
  alt: string;
  fallbackImage?: string;
  className?: string;
  onClick?: () => void;
}

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ThumbnailImage = styled.img<{ $isLoading?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: ${props => props.$isLoading ? 0.7 : 1};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  
  &:hover {
    transform: ${props => props.onClick ? 'scale(1.05)' : 'none'};
  }
`;

const LoadingOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 1;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 10px;
  z-index: 1;
`;

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoUrl,
  alt,
  fallbackImage = "/projects/placeholder-video.svg",
  className,
  onClick
}) => {
  const { thumbnail, isLoading, error } = useVideoThumbnail(videoUrl, fallbackImage);

  return (
    <ThumbnailContainer className={className}>
      <ThumbnailImage
        src={thumbnail}
        alt={alt}
        $isLoading={isLoading}
        onClick={onClick}
        onError={(e) => {
          // If the generated thumbnail fails, fallback to placeholder
          const target = e.target as HTMLImageElement;
          if (target.src !== fallbackImage) {
            target.src = fallbackImage;
          }
        }}
      />
      
      <LoadingOverlay $show={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>
      
      <ErrorOverlay $show={!!error && !isLoading}>
        <div>
          <div>⚠️</div>
          <div>Thumbnail unavailable</div>
        </div>
      </ErrorOverlay>
    </ThumbnailContainer>
  );
};
