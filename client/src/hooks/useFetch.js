import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for data fetching
 */
export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.request({
        url,
        ...options,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config) => execute(url, { method: 'GET', ...config }), [execute]);
  const post = useCallback((url, data, config) => execute(url, { method: 'POST', data, ...config }), [execute]);
  const put = useCallback((url, data, config) => execute(url, { method: 'PUT', data, ...config }), [execute]);
  const del = useCallback((url, config) => execute(url, { method: 'DELETE', ...config }), [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    get,
    post,
    put,
    del,
    reset,
  };
};

export default useFetch;
