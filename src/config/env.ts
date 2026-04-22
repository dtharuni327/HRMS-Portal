export const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  APP_NAME: process.env.REACT_APP_NAME || 'HRMS Portal',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  SESSION_TIMEOUT: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '3600000'), // 1 hour
  ITEMS_PER_PAGE: parseInt(process.env.REACT_APP_ITEMS_PER_PAGE || '10'),
};