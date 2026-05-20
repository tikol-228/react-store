import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, productsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const GUEST_CART_KEY = 'react-store-guest-cart';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  name: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
}

type GuestLine = {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function readGuestLines(): GuestLine[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestLines(lines: GuestLine[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines));
}

function guestLinesToCartItems(lines: GuestLine[]): CartItem[] {
  const now = new Date().toISOString();
  return lines.map((line) => ({
    id: line.product_id,
    user_id: 0,
    product_id: line.product_id,
    quantity: line.quantity,
    created_at: now,
    updated_at: now,
    name: line.name,
    price: line.price,
    image_url: line.image_url,
    stock_quantity: line.stock_quantity,
  }));
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setCartItems(guestLinesToCartItems(readGuestLines()));
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      setCartItems(response.data.cart || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const mergeGuestIntoServer = async () => {
      if (!user) {
        setCartItems(guestLinesToCartItems(readGuestLines()));
        return;
      }

      const guestLines = readGuestLines();
      if (guestLines.length > 0) {
        for (const line of guestLines) {
          try {
            await cartAPI.addToCart(line.product_id, line.quantity);
          } catch {
            /* skip lines that fail (e.g. stock) */
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }
      await refreshCart();
    };

    mergeGuestIntoServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshCart is stable enough for this flow
  }, [user]);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!user) {
      const { data } = await productsAPI.getProduct(productId);
      const p = data.product;
      if (!p || !p.is_active) {
        throw new Error('Товар недоступен');
      }
      const lines = readGuestLines();
      const idx = lines.findIndex((l) => l.product_id === productId);
      const nextQty = (idx >= 0 ? lines[idx].quantity : 0) + quantity;
      if (p.stock_quantity < nextQty) {
        throw new Error('Недостаточно товара на складе');
      }
      const line: GuestLine = {
        product_id: productId,
        quantity: nextQty,
        name: p.name,
        price: p.price,
        image_url: p.image_url,
        stock_quantity: p.stock_quantity,
      };
      if (idx >= 0) lines[idx] = line;
      else lines.push(line);
      saveGuestLines(lines);
      setCartItems(guestLinesToCartItems(lines));
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.addToCart(productId, quantity);
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const previousItems = cartItems;

    const applyLocalQuantity = (qty: number) => {
      if (qty <= 0) {
        setCartItems((items) => items.filter((i) => i.product_id !== productId));
        return;
      }
      setCartItems((items) =>
        items.map((i) =>
          i.product_id === productId
            ? { ...i, quantity: Math.min(qty, i.stock_quantity) }
            : i
        )
      );
    };

    if (!user) {
      const lines = readGuestLines();
      const idx = lines.findIndex((l) => l.product_id === productId);
      if (idx < 0) return;

      if (quantity <= 0) {
        lines.splice(idx, 1);
        saveGuestLines(lines);
        setCartItems(guestLinesToCartItems(lines));
        return;
      }

      applyLocalQuantity(quantity);

      try {
        const { data } = await productsAPI.getProduct(productId);
        const p = data.product;
        if (!p || p.stock_quantity < quantity) {
          setCartItems(previousItems);
          throw new Error('Недостаточно товара на складе');
        }
        lines[idx].quantity = quantity;
        lines[idx].stock_quantity = p.stock_quantity;
        saveGuestLines(lines);
        setCartItems(guestLinesToCartItems(lines));
      } catch (error: unknown) {
        setCartItems(previousItems);
        if (error instanceof Error) throw error;
        throw new Error('Не удалось изменить количество');
      }
      return;
    }

    if (quantity <= 0) {
      applyLocalQuantity(0);
      try {
        setIsLoading(true);
        const { data } = await cartAPI.removeFromCart(productId);
        setCartItems(data.cart || []);
      } catch (error: unknown) {
        setCartItems(previousItems);
        const message =
          error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;
        throw new Error(message || 'Не удалось удалить товар');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    applyLocalQuantity(quantity);

    try {
      setIsLoading(true);
      const { data } = await cartAPI.updateCartItem(productId, quantity);
      setCartItems(data.cart || []);
    } catch (error: unknown) {
      setCartItems(previousItems);
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      throw new Error(message || 'Не удалось изменить количество');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    const previousItems = cartItems;
    setCartItems((items) => items.filter((i) => i.product_id !== productId));

    if (!user) {
      const lines = readGuestLines().filter((l) => l.product_id !== productId);
      saveGuestLines(lines);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await cartAPI.removeFromCart(productId);
      setCartItems(data.cart || []);
    } catch (error: unknown) {
      setCartItems(previousItems);
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      throw new Error(message || 'Не удалось удалить товар');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCartItems([]);
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
