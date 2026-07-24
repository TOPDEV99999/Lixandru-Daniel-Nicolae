// Base44 SDK compatibility layer
// This file provides a drop-in replacement for Base44 SDK
// It redirects all calls to the local backend API

import localAPI from './localClient';

export const db = {
  // Authentication
  auth: {
    isAuthenticated: async () => {
      return localAPI.utils.isAuthenticated();
    },

    me: async () => {
      try {
        const response = await localAPI.auth.getCurrentUser();
        return response.user || null;
      } catch (error) {
        console.error('Auth me error:', error);
        return null;
      }
    },

    logout: (redirectUrl = '/') => {
      localAPI.auth.logout();
      if (redirectUrl && typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    },

    redirectToLogin: (returnUrl = '/') => {
      if (typeof window !== 'undefined') {
        window.location.href = `/login?return=${encodeURIComponent(returnUrl)}`;
      }
    }
  },

  // Functions (Base44 serverless functions)
  functions: {
    invoke: async (functionName, data = {}) => {
      try {
        let response;
        
        switch (functionName) {
          case 'getAvailability':
            response = await localAPI.availability.getAvailability(data.date || data);
            break;
          
          case 'submitMeeting':
            response = await localAPI.meeting.submitMeeting(data);
            break;
          
          case 'submitContact':
            response = await localAPI.contact.submitContact(data);
            break;
          
          case 'getAdminData':
            response = await localAPI.admin.getAdminData();
            break;
          
          case 'respondMeeting':
            if (data.id) {
              response = await localAPI.meeting.respondToMeeting(data.id, data);
            } else {
              throw new Error('Meeting ID is required');
            }
            break;
          
          case 'trackVisit':
            response = await localAPI.visitor.trackVisit();
            break;
          
          default:
            throw new Error(`Function ${functionName} not implemented`);
        }

        return {
          data: response,
          error: null,
          success: true
        };
      } catch (error) {
        const errorData = localAPI.utils.handleError(error);
        
        return {
          data: null,
          error: {
            message: errorData.message,
            status: errorData.status,
            details: errorData.details
          },
          success: false
        };
      }
    }
  },

  // Entities (for backward compatibility - most components don't use these)
  entities: new Proxy({}, {
    get: (target, entityName) => {
      // Return a mock entity interface
      return {
        filter: async () => [],
        get: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({})
      };
    }
  }),

  // Integrations (for backward compatibility)
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' }),
      SendEmail: async () => ({ success: true })
    }
  },

  // Service role access (for backward compatibility)
  asServiceRole: {
    entities: new Proxy({}, {
      get: (target, entityName) => {
        // Return a mock entity interface with service role
        return {
          filter: async () => [],
          get: async () => null,
          create: async () => ({}),
          update: async () => ({}),
          delete: async () => ({}),
          list: async (orderBy = '-created_date', limit = 500) => {
            // Mock list functionality
            return [];
          }
        };
      }
    }),
    integrations: {
      Core: {
        SendEmail: async () => ({ success: true })
      }
    }
  }
};

// Export for compatibility
export const base44 = db;
export default db;