export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
  logo?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  responsibilities: string[];
  technologies: string[];
  logo?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image?: string;
  rating?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  category: 'AR' | 'VR' | 'AR Filters' | 'Game Development' | '3D/CGI' | 'Web Development' | 'Mobile App';
  technologies: string[];
  tryOutLink?: string;
  projectUrl?: string;
  galleryImages?: string[];
  featured: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'AR' | 'VR' | 'CGI' | 'Development' | 'Design' | 'Other';
  proficiency: number; // 0-100
  icon?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
}

export interface Contact {
  email: string;
  phone?: string;
  address?: string;
  socialMedia: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    behance?: string;
    artstation?: string;
  };
}
