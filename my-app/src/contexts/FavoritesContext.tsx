import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string | number) => void;
  isFavorite: (productId: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    const normalized: Product = { ...product, id: String(product.id) };
    setFavorites((prev) => {
      if (prev.find((item) => String(item.id) === normalized.id)) {
        return prev;
      }
      return [...prev, normalized];
    });
  };

  const removeFromFavorites = (productId: string | number) => {
    const key = String(productId);
    setFavorites((prev) => prev.filter((item) => String(item.id) !== key));
  };

  const isFavorite = (productId: string | number) => {
    const key = String(productId);
    return favorites.some((item) => String(item.id) === key);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites должен быть использован внутри FavoritesProvider');
  }
  return context;
};