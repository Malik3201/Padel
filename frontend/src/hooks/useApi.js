import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading, error, and data states
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
};

// Custom hook for paginated data
export const usePaginatedApi = (apiFunction, initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchData = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const mergedFilters = { ...filters, ...newFilters };
      const result = await apiFunction(mergedFilters);
      setData(result.data);
      setPagination(result.pagination);
      setFilters(mergedFilters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, filters]);

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.current >= pagination.pages) return;
    
    setLoading(true);
    try {
      const nextPageFilters = { ...filters, page: pagination.current + 1 };
      const result = await apiFunction(nextPageFilters);
      setData(prev => [...prev, ...result.data]);
      setPagination(result.pagination);
      setFilters(nextPageFilters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, filters, pagination]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchData(newFilters);
  }, [fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    filters,
    fetchData,
    loadMore,
    refresh,
    updateFilters,
  };
};

// Custom hook for form submissions
export const useFormSubmit = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await apiFunction(...args);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { loading, error, success, submit, reset };
};
