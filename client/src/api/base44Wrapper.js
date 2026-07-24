// Base44 wrapper that conditionally loads the real Base44 or our compatibility layer
// This allows us to switch between Base44 and local backend without changing component code

let db;

if (process.env.VITE_USE_LOCAL_BACKEND === 'true' || !process.env.VITE_BASE44_APP_ID) {
  // Use local backend compatibility layer
  console.log('Using local backend compatibility layer');
  import('./base44Compatibility.js').then(module => {
    db = module.default;
  }).catch(error => {
    console.error('Failed to load compatibility layer:', error);
    // Fallback to stub
    db = {
      auth: { 
        isAuthenticated: async () => false, 
        me: async () => null,
        logout: () => {},
        redirectToLogin: () => {}
      },
      entities: new Proxy({}, { get: () => ({
        filter: async () => [],
        get: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({})
      })}),
      integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } },
      functions: { invoke: async () => ({ data: null, error: null, success: false }) }
    };
  });
} else {
  // Use real Base44 SDK (would need to be loaded from CDN)
  console.log('Using Base44 SDK (not implemented - using stub)');
  db = {
    auth: { 
      isAuthenticated: async () => false, 
      me: async () => null,
      logout: () => {},
      redirectToLogin: () => {}
    },
    entities: new Proxy({}, { get: () => ({
      filter: async () => [],
      get: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({})
    })}),
    integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } },
    functions: { invoke: async () => ({ data: null, error: null, success: false }) }
  };
}

// Export with a getter to ensure it's always available
export const getDB = () => db;

// Default export for compatibility
const exportedDB = new Proxy({}, {
  get: (target, prop) => {
    return db[prop];
  }
});

export default exportedDB;