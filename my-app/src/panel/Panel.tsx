import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, productsAPI, ordersAPI, usersAPI, categoriesAPI, contactsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Trash2, CheckCircle, Users, Loader, Calendar, AlertCircle, Pencil } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { filterStoreCategories } from '../data/storeCategories';
import { filterStoreBrands } from '../data/storeBrands';
import { CARE_TYPE_OPTIONS, careTypeLabel, type ProductCareType } from '../data/productCareTypes';
import {
  SKIN_TYPE_OPTIONS,
  parseSkinTypes,
  serializeSkinTypes,
  skinTypesLabel,
  type ProductSkinType,
} from '../data/productSkinTypes';
import CategorySelect from '../components/CategorySelect';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id?: number;
  brand_id?: number;
  care_type?: ProductCareType | string;
  skin_type?: ProductSkinType | string;
  stock_quantity: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
  brand_name?: string;
}

const emptyProductForm = {
  name: '',
  description: '',
  price: 0,
  category_id: '',
  brand_id: '',
  care_type: '' as '' | ProductCareType,
  skin_types: [] as ProductSkinType[],
  stock_quantity: 0,
  image_url: '',
};

interface Order {
  id: number;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  comment?: string;
  created_at: string;
  updated_at: string;
  items?: any[];
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ContactRecord {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  type?: string;
  is_read: number;
  created_at: string;
}

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  unreadContacts: number;
  unreadBookings: number;
  unreadNotifications: number;
}

const Panel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'bookings'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<ContactRecord[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [adminNewOrder, setAdminNewOrder] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    comment: '',
    user_id: '',
    product_id: '',
    quantity: 1,
  });

  const [newProduct, setNewProduct] = useState({ ...emptyProductForm });

  const [productImagePreview, setProductImagePreview] = useState<string>('');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, usersRes, categoriesRes, brandsRes, bookingsRes] =
        await Promise.all([
        adminAPI.getDashboardStats(),
        productsAPI.getProducts({ limit: 200 }),
        ordersAPI.getOrders({ limit: 50 }),
        usersAPI.getUsers(),
        categoriesAPI.getCategories(),
        categoriesAPI.getBrands(),
        contactsAPI.getContacts('booking'),
      ]);

      setStats(statsRes.data.stats);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
      setBookings(bookingsRes.data.contacts || []);
      setCategories(filterStoreCategories(categoriesRes.data.categories || []));
      setBrands(filterStoreBrands(brandsRes.data.brands || []));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const { data } = await contactsAPI.getContacts('booking');
      setBookings(data.contacts || []);
      const statsRes = await adminAPI.getDashboardStats();
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const handleMarkBookingRead = async (id: number) => {
    try {
      await contactsAPI.markAsRead(id);
      await loadBookings();
    } catch (error) {
      console.error('Failed to mark booking as read:', error);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm('Удалить эту заявку на подбор косметики?')) return;
    try {
      await contactsAPI.deleteContact(id);
      await loadBookings();
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Ограничение на размер файла: 2МБ
      if (file.size > 2 * 1024 * 1024) {
        alert('Размер файла не должен превышать 2МБ');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProductImagePreview(base64);
        setNewProduct({ ...newProduct, image_url: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetProductForm = () => {
    setNewProduct({ ...emptyProductForm });
    setProductImagePreview('');
    setEditingProductId(null);
  };

  const buildProductPayload = () => {
    const categoryId = parseInt(String(newProduct.category_id), 10);
    const brandId = parseInt(String(newProduct.brand_id), 10);
    return {
      name: newProduct.name.trim(),
      description: newProduct.description.replace(/^\s+|\s+$/g, '') || '—',
      price: parseFloat(String(newProduct.price)),
      stock_quantity: parseInt(String(newProduct.stock_quantity), 10),
      image_url: newProduct.image_url || undefined,
      category_id: categoryId,
      brand_id: brandId,
      care_type: newProduct.care_type as ProductCareType,
      skin_type: serializeSkinTypes(newProduct.skin_types) || undefined,
    };
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description === '—' ? '' : product.description,
      price: product.price,
      category_id: product.category_id ? String(product.category_id) : '',
      brand_id: product.brand_id ? String(product.brand_id) : '',
      care_type: (product.care_type as ProductCareType) || '',
      skin_types: parseSkinTypes(product.skin_type),
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || '',
    });
    setProductImagePreview(product.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !newProduct.name ||
        !newProduct.price ||
        newProduct.stock_quantity === undefined ||
        !newProduct.category_id ||
        !newProduct.brand_id ||
        !newProduct.care_type ||
        newProduct.skin_types.length === 0
      ) {
        alert(
          'Заполните обязательные поля: название, цена, количество, категория, бренд, тип ухода, хотя бы один тип кожи'
        );
        return;
      }

      const payload = buildProductPayload();

      if (editingProductId) {
        const existing = products.find((p) => p.id === editingProductId);
        await productsAPI.updateProduct(editingProductId, {
          ...payload,
          is_active: existing?.is_active ?? 1,
        });
        alert('Товар успешно обновлён!');
      } else {
        await productsAPI.createProduct(payload);
        alert('Товар успешно добавлен!');
      }

      resetProductForm();
      const productsRes = await productsAPI.getProducts({ limit: 200 });
      setProducts(productsRes.data.products || []);
    } catch (error: any) {
      console.error('Failed to save product:', error);
      const details = error.response?.data?.details;
      const detailText = Array.isArray(details)
        ? details.map((d: { msg?: string }) => d.msg).filter(Boolean).join('\n')
        : '';
      const errorMessage =
        error.response?.data?.message || error.message || 'Не удалось сохранить товар';
      alert(detailText ? `Ошибка: ${errorMessage}\n${detailText}` : `Ошибка: ${errorMessage}`);
    }
  };

  const handleAdminOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pid = parseInt(String(adminNewOrder.product_id), 10);
      const qty = parseInt(String(adminNewOrder.quantity), 10);
      const prod = products.find((p) => p.id === pid);
      if (!prod) {
        alert('Выберите товар из списка');
        return;
      }
      await adminAPI.createOrder({
        customer_name: adminNewOrder.customer_name,
        customer_email: adminNewOrder.customer_email,
        customer_phone: adminNewOrder.customer_phone,
        shipping_address: adminNewOrder.shipping_address,
        comment: adminNewOrder.comment || undefined,
        user_id: adminNewOrder.user_id ? parseInt(String(adminNewOrder.user_id), 10) : undefined,
        items: [{ product_id: pid, quantity: qty, price: prod.price }],
      });
      setAdminNewOrder({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        comment: '',
        user_id: '',
        product_id: '',
        quantity: 1,
      });
      const [ordersRes, statsRes] = await Promise.all([
        ordersAPI.getOrders({ limit: 50 }),
        adminAPI.getDashboardStats(),
      ]);
      setOrders(ordersRes.data.orders || []);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Failed to create admin order:', error);
      alert('Не удалось создать заказ');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await ordersAPI.updateOrderStatus(id, status);
      setOrders(orders.map(order =>
        order.id === id ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.deleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещён</h1>
          <p className="text-gray-600">У вас нет прав для доступа к этой странице.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
            <Link
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Вернуться в магазин
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'dashboard', label: 'Панель', icon: Package },
            { id: 'products', label: 'Товары', icon: ShoppingBag },
            { id: 'orders', label: 'Заказы', icon: CheckCircle },
            { id: 'users', label: 'Пользователи', icon: Users },
            { id: 'bookings', label: 'Подбор', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего заказов</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего товаров</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className="bg-white p-6 rounded-lg shadow-sm text-left hover:ring-2 hover:ring-[#1B4B43]/20 transition-all w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Новые записи</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.unreadBookings ?? 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-[#1B4B43]" />
              </div>
            </button>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {editingProductId ? 'Редактировать товар' : 'Добавить новый товар'}
              </h2>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Название товара"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Цена"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Картинка товара</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageChange}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {productImagePreview && (
                    <img 
                      src={productImagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                    />
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Количество на складе"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <CategorySelect
                  categories={categories}
                  value={newProduct.category_id}
                  onChange={(category_id) => setNewProduct({ ...newProduct, category_id })}
                  placeholder="Выберите категорию"
                />
                <CategorySelect
                  categories={brands}
                  value={newProduct.brand_id}
                  onChange={(brand_id) => setNewProduct({ ...newProduct, brand_id })}
                  placeholder="Выберите бренд"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип ухода
                  </label>
                  <select
                    value={newProduct.care_type}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        care_type: e.target.value as '' | ProductCareType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  >
                    <option value="">Выберите тип ухода</option>
                    {CARE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип кожи <span className="font-normal text-gray-500">(можно выбрать несколько)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-md border border-gray-200 p-3 bg-gray-50/50">
                    {SKIN_TYPE_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newProduct.skin_types.includes(opt.value)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setNewProduct((prev) => ({
                              ...prev,
                              skin_types: checked
                                ? [...prev.skin_types, opt.value]
                                : prev.skin_types.filter((t) => t !== opt.value),
                            }));
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-[#1B4B43] focus:ring-[#1B4B43]"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Описание (Enter — новая строка, пустая строка — новый абзац)"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2 whitespace-pre-wrap"
                  rows={6}
                />
                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingProductId ? 'Сохранить изменения' : 'Добавить товар'}
                  </button>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Товары ({products.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория / бренд</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Уход / кожа</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Остаток</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image_url || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{product.category_name || '—'}</div>
                          <div className="text-gray-400">{product.brand_name || '—'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{careTypeLabel(product.care_type)}</div>
                          <div className="text-gray-400">{skinTypesLabel(product.skin_type)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(product)}
                              className="text-[#1B4B43] hover:text-[#2a6b5f]"
                              title="Редактировать"
                              aria-label="Редактировать товар"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Удалить"
                              aria-label="Удалить товар"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Создать заказ (админ)</h2>
              <form onSubmit={handleAdminOrderSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Имя клиента *"
                  value={adminNewOrder.customer_name}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, customer_name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={adminNewOrder.customer_email}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, customer_email: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Телефон *"
                  value={adminNewOrder.customer_phone}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, customer_phone: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Адрес доставки *"
                  value={adminNewOrder.shipping_address}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, shipping_address: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={adminNewOrder.product_id}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, product_id: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Выберите товар *</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Количество"
                  value={adminNewOrder.quantity}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, quantity: parseInt(e.target.value, 10) || 1 })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={adminNewOrder.user_id}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, user_id: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                >
                  <option value="">Привязать к аккаунту (необязательно)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.email})
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Комментарий"
                  value={adminNewOrder.comment}
                  onChange={(e) => setAdminNewOrder({ ...adminNewOrder, comment: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                  rows={2}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 md:col-span-2"
                >
                  Создать заказ
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Заказы ({orders.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID заказа</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span>#{order.id}</span>
                        {order.comment?.startsWith('[DEMO]') && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                            demo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{order.customer_name}</div>
                        {order.comment && (
                          <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={order.comment}>
                            {order.comment}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(Number(order.total_amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">В ожидании</option>
                          <option value="processing">В обработке</option>
                          <option value="shipped">Отправлено</option>
                          <option value="delivered">Доставлено</option>
                          <option value="cancelled">Отменено</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Подбор косметики ({bookings.length})</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Заявки с формы «Подобрать косметику» на сайте
                </p>
              </div>
              <button
                type="button"
                onClick={loadBookings}
                className="px-4 py-2 text-sm font-medium text-[#1B4B43] border border-[#1B4B43]/30 rounded-lg hover:bg-[#1B4B43]/5"
              >
                Обновить
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Заявок на подбор косметики пока нет</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клиент</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Контакты</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Комментарий</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className={booking.is_read ? 'bg-white' : 'bg-[#1B4B43]/5'}
                      >
                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(booking.created_at).toLocaleString('ru-RU')}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{booking.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <a href={`tel:${booking.phone}`} className="block hover:text-[#1B4B43]">
                            {booking.phone || '—'}
                          </a>
                          <a href={`mailto:${booking.email}`} className="block text-gray-500 hover:text-[#1B4B43]">
                            {booking.email}
                          </a>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                          <p className="line-clamp-3">{booking.message}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.is_read
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-[#1B4B43] text-white'
                            }`}
                          >
                            {booking.is_read ? 'Просмотрена' : 'Новая'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {!booking.is_read && (
                              <button
                                type="button"
                                onClick={() => handleMarkBookingRead(booking.id)}
                                className="px-3 py-1.5 text-[#1B4B43] border border-[#1B4B43]/30 rounded-md hover:bg-[#1B4B43]/5"
                              >
                                Прочитано
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="p-1.5 text-red-600 hover:text-red-800"
                              aria-label="Удалить"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Пользователи ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;