const fs = require('node:fs/promises');
const path = require('node:path');

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

const DEFAULT_DATA = {
  profile: {
    name: 'Nikhil Shinde',
    title: 'Computer Engineering Student',
    bio: 'Student builder focused on web development and AI-powered educational products.',
    email: 'nikhil.shinde@classgrid.in',
    location: 'Pune, India',
  },
  projects: [],
  testimonials: [],
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeProject = (project) => ({
  id: String(project.id || ''),
  title: String(project.title || ''),
  description: String(project.description || ''),
  thumbnail: project.thumbnail || null,
  videoUrl: project.videoUrl || null,
  category: String(project.category || 'Web Development'),
  technologies: toArray(project.technologies).map((item) => String(item)),
  tryOutLink: project.tryOutLink || null,
  projectUrl: project.projectUrl || null,
  galleryImages: toArray(project.galleryImages).map((item) => String(item)),
  featured: Boolean(project.featured),
});

const normalizeTestimonial = (testimonial) => ({
  id: String(testimonial.id || ''),
  name: String(testimonial.name || ''),
  position: String(testimonial.position || ''),
  company: String(testimonial.company || ''),
  testimonial: String(testimonial.testimonial || ''),
  image: testimonial.image || null,
  rating: Number.isFinite(Number(testimonial.rating))
    ? Number(testimonial.rating)
    : undefined,
});

function normalizeData(raw) {
  const data = raw && typeof raw === 'object' ? raw : {};

  return {
    profile: {
      ...DEFAULT_DATA.profile,
      ...(data.profile && typeof data.profile === 'object' ? data.profile : {}),
    },
    projects: toArray(data.projects).map(normalizeProject),
    testimonials: toArray(data.testimonials).map(normalizeTestimonial),
  };
}

async function loadPortfolioData() {
  try {
    const fileContents = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(fileContents);
    return normalizeData(parsed);
  } catch {
    return normalizeData(DEFAULT_DATA);
  }
}

function buildStats(data) {
  const projects = toArray(data.projects);
  const testimonials = toArray(data.testimonials);

  return {
    projects: projects.length,
    testimonials: testimonials.length,
    featured_projects: projects.filter((project) => Boolean(project.featured)).length,
  };
}

module.exports = {
  loadPortfolioData,
  buildStats,
};
