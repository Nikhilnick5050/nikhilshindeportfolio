import { useState, useEffect } from 'react';
import { generateVideoThumbnail, getValidThumbnail } from '../utils/videoThumbnails';

export const useVideoThumbnail = (videoUrl: string, fallbackImage?: string) => {
  const [thumbnail, setThumbnail] = useState<string>(() => 
    generateVideoThumbnail(videoUrl, fallbackImage)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const validThumbnail = await getValidThumbnail(videoUrl, fallbackImage);
        setThumbnail(validThumbnail);
      } catch (err) {
        setError('Failed to load thumbnail');
        setThumbnail(fallbackImage || '/projects/placeholder-video.svg');
      } finally {
        setIsLoading(false);
      }
    };

    if (videoUrl) {
      loadThumbnail();
    }
  }, [videoUrl, fallbackImage]);

  return { thumbnail, isLoading, error };
};
