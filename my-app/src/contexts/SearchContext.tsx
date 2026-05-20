import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from '../utils/scrollToSection';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  applySearch: (query?: string) => void;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const applySearch = useCallback(
    (query?: string) => {
      const trimmed = (query ?? searchQuery).trim();
      setSearchQuery(trimmed);

      if (location.pathname !== '/') {
        const path = trimmed
          ? `/?q=${encodeURIComponent(trimmed)}#products`
          : '/#products';
        navigate(path);
        return;
      }

      scrollToSection('products');
      const url = trimmed
        ? `/?q=${encodeURIComponent(trimmed)}#products`
        : '#products';
      window.history.replaceState(null, '', url);
    },
    [searchQuery, location.pathname, navigate]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    if (location.pathname === '/') {
      window.history.replaceState(null, '', window.location.hash || '/');
    }
  }, [location.pathname]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, applySearch, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
};
