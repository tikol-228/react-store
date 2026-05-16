import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, productsAPI, ordersAPI, usersAPI, categoriesAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Trash2, CheckCircle, Users, Loader, AlertCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id?: number;
  stock_quantity: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

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

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  unreadContacts: number;
  unreadNotifications: number;
}

const Panel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

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

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    stock_quantity: 0,
    image_url: '',
  });

  const [productImagePreview, setProductImagePreview] = useState<string>('');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, usersRes, categoriesRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        productsAPI.getProducts({ limit: 200 }),
        ordersAPI.getOrders({ limit: 50 }),
        usersAPI.getUsers(),
        categoriesAPI.getCategories(),
      ]);

      setStats(statsRes.data.stats);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.stock_quantity) {
        alert('Заполните обязательные поля: Название, Цена, Количество');
        return;
      }

      const categoryId =
        newProduct.category_id === '' || newProduct.category_id === undefined
          ? null
          : parseInt(String(newProduct.category_id), 10);
      await productsAPI.createProduct({
        name: newProduct.name,
        description: (newProduct.description || '').trim() || '—',
        price: parseFloat(String(newProduct.price)),
        stock_quantity: parseInt(String(newProduct.stock_quantity), 10),
        image_url: newProduct.image_url || undefined,
        category_id: categoryId,
      });
      alert('Товар успешно добавлен!');
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        stock_quantity: 0,
        image_url: '',
      });
      setProductImagePreview('');
      const productsRes = await productsAPI.getProducts({ limit: 200 });
      setProducts(productsRes.data.products || []);
    } catch (error: any) {
      console.error('Failed to create product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Не удалось добавить товар';
      alert(`Ошибка: ${errorMessage}`);
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
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Новые сообщения</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.unreadContacts}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Добавить новый товар</h2>
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
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Описание"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                  rows={3}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 md:col-span-2"
                >
                  Добавить товар
                </button>
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
                              <div className="text-sm text-gray-500">{product.category_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer_name}
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