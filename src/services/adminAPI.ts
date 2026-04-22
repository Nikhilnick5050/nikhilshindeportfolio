// Service to fetch data from admin panel API
const API_BASE_URL = (process.env.REACT_APP_API_URL || '').trim();

const resolveApiEndpointBase = () => {
  if (!API_BASE_URL) {
    return '/api/admin';
  }

  const normalized = API_BASE_URL.replace(/\/+$/, '');

  if (normalized.endsWith('/api/admin') || normalized.endsWith('/admin/api.php')) {
    return normalized;
  }

  return `${normalized}/api/admin`;
};

const API_ENDPOINT_BASE = resolveApiEndpointBase();

const isHtmlResponse = (value: string) => {
  const trimmed = value.trim();
  return trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<');
};

const fetchJson = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_ENDPOINT_BASE}?endpoint=${encodeURIComponent(endpoint)}`, {
    headers: { Accept: 'application/json' },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (!body) {
    throw new Error('Empty API response');
  }

  if (isHtmlResponse(body)) {
    throw new Error('Received HTML instead of JSON. Check REACT_APP_API_URL and backend availability.');
  }

  return JSON.parse(body) as T;
};

class AdminAPIService {
  // Fetch projects from admin panel
  static async getProjects() {
    try {
      return await fetchJson<any[]>('projects');
    } catch (error) {
      console.warn('Projects API unavailable, using local data fallback.', error);
      // Fallback to static data
      return [];
    }
  }

  // Fetch testimonials from admin panel
  static async getTestimonials() {
    try {
      return await fetchJson<any[]>('testimonials');
    } catch (error) {
      console.warn('Testimonials API unavailable, using local data fallback.', error);
      // Fallback to static data
      return [];
    }
  }

  // Fetch statistics
  static async getStats() {
    try {
      return await fetchJson<{ projects: number; testimonials: number; featured_projects: number }>('stats');
    } catch (error) {
      console.warn('Stats API unavailable, using local default stats.', error);
      return { projects: 0, testimonials: 0, featured_projects: 0 };
    }
  }
}

export default AdminAPIService;
