import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Testimonial } from '../types';
import AdminAPIService from '../services/adminAPI';
import { projectData, testimonialData } from '../utils/portfolioData';

interface PortfolioContextType {
  projects: Project[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: React.ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(projectData);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from admin API
      const [apiProjects, apiTestimonials] = await Promise.all([
        AdminAPIService.getProjects(),
        AdminAPIService.getTestimonials()
      ]);

      // If API returns data, use it; otherwise keep static data
      if (apiProjects && apiProjects.length > 0) {
        setProjects(apiProjects);
      }

      if (apiTestimonials && apiTestimonials.length > 0) {
        setTestimonials(apiTestimonials);
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Using static data - admin panel not connected');
      // Keep using static data as fallback (already set as initial state)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        testimonials,
        loading,
        error,
        refreshData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
