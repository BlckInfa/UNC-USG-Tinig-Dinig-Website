/**
 * Application Configuration
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'USG Tinig Dinig',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: 'UNC University Student Government Portal',
};

export const THEME_CONFIG = {
  defaultTheme: 'light',
  storageKey: 'usg-theme',
};

export const AUTH_CONFIG = {
  tokenKey: 'usg-token',
  refreshTokenKey: 'usg-refresh-token',
  userKey: 'usg-user',
};

export default {
  APP_CONFIG,
  THEME_CONFIG,
  AUTH_CONFIG,
};
