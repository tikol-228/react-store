import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => api.post('/auth/register', userData),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (userData: { first_name: string; last_name: string; phone?: string }) =>
    api.put('/auth/profile', userData),
};

export const productsAPI = {
  getProducts: (params?: { page?: number; limit?: number; category_id?: number; search?: string }) =>
    api.get('/products', { params }),

  getProduct: (id: number) => api.get(`/products/${id}`),

  createProduct: (productData: any) => api.post('/products', productData),

  updateProduct: (id: number, productData: any) => api.put(`/products/${id}`, productData),

  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),

  getCategory: (id: number) => api.get(`/categories/${id}`),

  createCategory: (categoryData: any) => api.post('/categories', categoryData),

  updateCategory: (id: number, categoryData: any) => api.put(`/categories/${id}`, categoryData),

  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
};

export const ordersAPI = {
  createOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    comment?: string;
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>;
  }) => api.post('/orders', orderData),

  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/orders', { params }),

  getOrder: (id: number) => api.get(`/orders/${id}`),

  updateOrderStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),

  addToCart: (productId: number, quantity: number) =>
    api.post('/cart', { product_id: productId, quantity }),

  updateCartItem: (productId: number, quantity: number) =>
    api.put('/cart', { product_id: productId, quantity }),

  removeFromCart: (productId: number) => api.delete(`/cart/item/${productId}`),

  clearCart: () => api.delete('/cart'),
};

export const reviewsAPI = {
  getProductReviews: (productId: number) => api.get(`/reviews/product/${productId}`),

  getUserReviews: () => api.get('/reviews/user'),

  createReview: (reviewData: { product_id: number; rating: number; comment?: string }) =>
    api.post('/reviews', reviewData),

  updateReview: (id: number, reviewData: { rating: number; comment?: string }) =>
    api.put(`/reviews/${id}`, reviewData),

  deleteReview: (id: number) => api.delete(`/reviews/${id}`),
};

export const usersAPI = {
  getUsers: () => api.get('/users'),

  getUser: (id: number) => api.get(`/users/${id}`),

  updateUser: (id: number, userData: any) => api.put(`/users/${id}`, userData),

  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

export const contactsAPI = {
  createContact: (contactData: { name: string; email: string; phone?: string; message: string }) =>
    api.post('/contacts', contactData),

  getContacts: () => api.get('/contacts'),

  markAsRead: (id: number) => api.patch(`/contacts/${id}/read`),

  deleteContact: (id: number) => api.delete(`/contacts/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),

  getNotifications: () => api.get('/admin/notifications'),

  markNotificationAsRead: (id: number) => api.patch(`/admin/notifications/${id}/read`),

  deleteNotification: (id: number) => api.delete(`/admin/notifications/${id}`),

  getPanelAuth: () => api.get('/admin/panel-auth'),

  verifyPanelPin: (pin: string) => api.post('/admin/panel-auth', { pin }),

  createOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    comment?: string;
    user_id?: number | null;
    items: Array<{ product_id: number; quantity: number; price?: number }>;
  }) => api.post('/admin/orders', orderData),
};