/**
 * Utility functions for generating video thumbnails from various video sources
 */

export const generateVideoThumbnail = (videoUrl: string, fallbackImage?: string): string => {
  // Return fallback if provided and video URL is empty
  if (!videoUrl && fallbackImage) {
    return fallbackImage;
  }

  // YouTube video thumbnail extraction
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (videoId) {
      // Try high quality thumbnail first, fallback to medium quality
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  // Cloudinary video thumbnail extraction
  if (videoUrl.includes('cloudinary.com')) {
    // Extract the public ID from the Cloudinary URL and generate thumbnail
    const thumbnailUrl = convertCloudinaryVideoToThumbnail(videoUrl);
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
  }

  // Google Drive video - no direct thumbnail available
  if (videoUrl.includes('drive.google.com')) {
    // Return a placeholder or fallback image for Google Drive videos
    return fallbackImage || '/projects/placeholder-video.jpg';
  }

  // Fiverr attachments - try to convert to image format
  if (videoUrl.includes('fiverr-res.cloudinary.com')) {
    const thumbnailUrl = convertFiverrVideoToThumbnail(videoUrl);
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
  }

  // Default fallback
  return fallbackImage || '/projects/placeholder-video.jpg';
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

export const convertCloudinaryVideoToThumbnail = (videoUrl: string): string | null => {
  try {
    // Convert Cloudinary video URL to thumbnail by replacing video parameters
    if (videoUrl.includes('cloudinary.com/video/upload/')) {
      // Replace video upload path with image path and add thumbnail transformations
      const thumbnailUrl = videoUrl
        .replace('/video/upload/', '/image/upload/')
        .replace(/\.(mp4|mov|avi|mkv|webm)$/, '.jpg')
        // Add thumbnail transformations - get frame at 1 second
        .replace('/upload/', '/upload/so_1.0,w_800,h_450,c_fill,q_auto,f_jpg/');

      return thumbnailUrl;
    }
  } catch (error) {
    console.warn('Failed to convert Cloudinary video to thumbnail:', error);
  }
  return null;
};

export const convertFiverrVideoToThumbnail = (videoUrl: string): string | null => {
  try {
    // Fiverr uses Cloudinary, so we can use similar logic
    if (videoUrl.includes('fiverr-res.cloudinary.com/video/upload/')) {
      // Convert to image URL with thumbnail parameters
      const thumbnailUrl = videoUrl
        .replace('/video/upload/', '/image/upload/')
        .replace(/\.(mp4|mov|avi|mkv|webm)$/, '.jpg')
        // Add frame extraction at 1 second and resize
        .replace('/upload/', '/upload/so_1.0,w_800,h_450,c_fill,q_auto,f_jpg/');

      return thumbnailUrl;
    }
  } catch (error) {
    console.warn('Failed to convert Fiverr video to thumbnail:', error);
  }
  return null;
};

export const preloadThumbnail = (thumbnailUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = thumbnailUrl;
  });
};

// Fallback function to check if thumbnail loads, if not return fallback
export const getValidThumbnail = async (videoUrl: string, fallbackImage?: string): Promise<string> => {
  const generatedThumbnail = generateVideoThumbnail(videoUrl, fallbackImage);

  // For YouTube, try maxresdefault first, then fallback to hqdefault if it fails
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (videoId) {
      const maxResThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const hqThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Check if maxres thumbnail exists
      const maxResExists = await preloadThumbnail(maxResThumbnail);
      if (maxResExists) {
        return maxResThumbnail;
      } else {
        return hqThumbnail; // Fallback to HQ thumbnail
      }
    }
  }

  return generatedThumbnail;
};
