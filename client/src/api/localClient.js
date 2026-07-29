import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://manufacturer-word-improvements-appreciation.trycloudflare.com/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors and refreshing tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized) - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        
        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login page if we're not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (contactData) => {
    const response = await apiClient.post('/contact', contactData);
    return response.data;
  },

  getContactMessages: async (params = {}) => {
    const response = await apiClient.get('/contact', { params });
    return response.data;
  },

  getContactMessage: async (id) => {
    const response = await apiClient.get(`/contact/${id}`);
    return response.data;
  },

  updateContactStatus: async (id, statusData) => {
    const response = await apiClient.put(`/contact/${id}`, statusData);
    return response.data;
  },

  deleteContactMessage: async (id) => {
    const response = await apiClient.delete(`/contact/${id}`);
    return response.data;
  },
};

// Meeting API
export const meetingAPI = {
  submitMeeting: async (meetingData) => {
    const response = await apiClient.post('/meeting', meetingData);
    return response.data;
  },

  getMeetings: async (params = {}) => {
    const response = await apiClient.get('/meeting', { params });
    return response.data;
  },

  getMeeting: async (id) => {
    const response = await apiClient.get(`/meeting/${id}`);
    return response.data;
  },

  respondToMeeting: async (id, responseData) => {
    const response = await apiClient.post(`/meeting/${id}/respond`, responseData);
    return response.data;
  },

  updateMeeting: async (id, meetingData) => {
    const response = await apiClient.put(`/meeting/${id}`, meetingData);
    return response.data;
  },

  deleteMeeting: async (id) => {
    const response = await apiClient.delete(`/meeting/${id}`);
    return response.data;
  },
};

// Availability API
export const availabilityAPI = {
  getAvailability: async (date) => {
    const response = await apiClient.post('/availability', { date });
    return response.data;
  },

  getWeeklyAvailability: async (startDate, endDate) => {
    const response = await apiClient.get('/availability/weekly', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

// Visitor API
export const visitorAPI = {
  trackVisit: async () => {
    const response = await apiClient.post('/visit');
    return response.data;
  },

  getVisitorAnalytics: async (params = {}) => {
    const response = await apiClient.get('/visit/analytics', { params });
    return response.data;
  },

  getVisitors: async (params = {}) => {
    const response = await apiClient.get('/visit', { params });
    return response.data;
  },

  getVisitor: async (id) => {
    const response = await apiClient.get(`/visit/${id}`);
    return response.data;
  },

  deleteVisitor: async (id) => {
    const response = await apiClient.delete(`/visit/${id}`);
    return response.data;
  },

  updateVisitor: async (id, data) => {
    const response = await apiClient.put(`/visit/${id}`, data);
    return response.data;
  },
};

// Email API
export const emailAPI = {
  sendMeetingAcceptance: async (emailData) => {
    const response = await apiClient.post('/email/send-meeting-acceptance', emailData);
    return response.data;
  },

  sendMeetingRejection: async (emailData) => {
    const response = await apiClient.post('/email/send-meeting-rejection', emailData);
    return response.data;
  },

  sendContactReply: async (emailData) => {
    const response = await apiClient.post('/email/send-contact-reply', emailData);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAdminData: async () => {
    const response = await apiClient.get('/admin/data');
    return response.data;
  },

  getDashboardStats: async (params = {}) => {
    const response = await apiClient.get('/admin/dashboard', { params });
    return response.data;
  },

  // Admin contact management
  getAdminContacts: async (params = {}) => {
    const response = await apiClient.get('/admin/contacts', { params });
    return response.data;
  },

  // Admin meeting management
  getAdminMeetings: async (params = {}) => {
    const response = await apiClient.get('/admin/meetings', { params });
    return response.data;
  },

  // Admin visitor analytics
  getAdminVisitors: async (params = {}) => {
    const response = await apiClient.get('/admin/visitors', { params });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Save user data to localStorage
  saveUserData: (user, tokens) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (tokens?.accessToken) {
      localStorage.setItem('accessToken', tokens.accessToken);
    }
    if (tokens?.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  },

  // Clear all user data
  clearUserData: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        message: error.response.data?.error || 'An error occurred',
        details: error.response.data?.details,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
      };
    } else {
      // Something happened in setting up the request
      return {
        status: -1,
        message: error.message || 'An unexpected error occurred',
      };
    }
  },
};

// Export the main API object (similar to the original Base44 client interface)
export const localAPI = {
  auth: authAPI,
  contact: contactAPI,
  meeting: meetingAPI,
  availability: availabilityAPI,
  visitor: visitorAPI,
  admin: adminAPI,
  health: healthAPI,
  utils: apiUtils,
  email: emailAPI,
};

// Default export for backward compatibility
export default localAPI;