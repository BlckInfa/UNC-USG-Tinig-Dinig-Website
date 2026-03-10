import { useEffect } from 'react';

const APP_NAME = 'UNC USG Tinig Dinig';

/**
 * Sets the browser tab title for the current page.
 * @param {string} title - Page-specific title (e.g. "Finance")
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
