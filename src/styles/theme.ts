export const theme = {  colors: {
    // Primary colors - Elegant black, white, whitish grey theme
    primary: '#E5E7EB', // Whitish grey for key accents
    secondary: '#6B7280', // Gray for secondary elements
    accent: '#F3F4F6', // Light whitish grey for highlights
    
    // Background colors
    background: {
      primary: '#000000', // Pure black
      secondary: '#111111', // Slightly lighter black
      card: '#1F1F1F', // Dark gray for cards (less stark)
    },
    
    // Text colors
    text: {
      primary: '#FFFFFF', // Pure white
      secondary: '#A1A1AA', // Medium gray for secondary text
      accent: '#E5E7EB', // Whitish grey for important highlights
    },
      // Minimal gradients
    gradients: {
      primary: 'linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)', // Whitish grey gradient
      secondary: 'linear-gradient(135deg, #000000 0%, #1F1F1F 100%)', // Black to gray gradient
    },
    
    // UI colors
    ui: {
      success: '#10B981', // Green for success (better UX)
      error: '#DC2626', // Red for errors
      warning: '#F59E0B', // Orange for warnings
      info: '#A1A1AA', // Gray for info
    },
  },
  
  // Font sizes
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    md: '1.125rem', // 18px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    '3xl': '2.5rem', // 40px
    '4xl': '3rem', // 48px
    '5xl': '4rem', // 64px
  },
  
  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '4rem', // 64px
    '3xl': '6rem', // 96px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '1rem', // 16px
    full: '9999px',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '576px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1600px',
  },

  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },

  // Animation durations
  animations: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
    verySlow: '0.8s',
  },

  // Z-index values
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
    tooltip: 200,
  },
};

export type Theme = typeof theme;
export default theme;
