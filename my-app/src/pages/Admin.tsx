import React, { useState, useEffect } from 'react';
import { initialProducts } from '../data/products';
import type { Product } from '../data/products';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    price: 0,
    category: '',
    rating: 0,
    badge: '',
    image: '',
  });

  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }

    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert('Пожалуйста, заполните обязательные поля (Название, Цена, Фото)');
      return;
    }

    const productToAdd: Product = {
      id: Date.now().toString(),
      title: newProduct.title!,
      price: newProduct.price!,
      image: newProduct.image!,
      category: newProduct.category || 'Общее',
      rating: newProduct.rating || 5.0,
      badge: newProduct.badge,
    };

    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    setNewProduct({
      title: '',
      price: 0,
      category: '',
      rating: 0,
      badge: '',
      image: '',
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1B4B43] text-white p-8 flex flex-col gap-8 fixed h-full">
        <Link to="/" className="text-xl font-bold tracking-tight mb-4">Art Capital Admin</Link>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-[#1B4B43] font-bold' : 'hover:bg-white/10'}`}
          >
            <Package size={20} />
            <span>Товары</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-[#1B4B43] font-bold' : 'hover:bg-white/10'}`}
          >
            <ShoppingBag size={20} />
            <span>Заказы</span>
          </button>
        </nav>

        <div className="mt-auto">
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Вернуться на сайт</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">
              {activeTab === 'products' ? 'Управление товарами' : 'Список заказов'}
            </h1>
            <p className="text-gray-400">Добро пожаловать в панель управления салоном</p>
          </div>
          {activeTab === 'products' && (
            <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
              Всего товаров: <span className="text-[#1B4B43]">{products.length}</span>
            </div>
          )}
        </header>

        {activeTab === 'products' ? (
          <div className="space-y-12">
            {/* Add Product Form */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-[#1B4B43]" />
                Добавить новый товар
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Название товара *</label>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Цена ($) *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Категория</label>
                  <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Рейтинг (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newProduct.rating}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Бейдж (Новинка, Хит)</label>
                  <input
                    type="text"
                    name="badge"
                    value={newProduct.badge}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Фото товара *</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1 text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1B4B43] file:text-white hover:file:bg-[#2a6b5f] transition-all"
                      required
                    />
                    {newProduct.image && (
                      <div className="h-14 w-14 bg-[#F6F6F6] rounded-xl overflow-hidden">
                        <img src={newProduct.image} alt="Preview" className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-4 px-4 rounded-xl hover:bg-black transition duration-300 font-bold shadow-lg"
                  >
                    Добавить товар в каталог
                  </button>
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-xl font-bold mb-6">Каталог товаров</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Товар</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Категория</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Цена</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-[#F6F6F6] rounded-xl overflow-hidden p-1">
                              <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
                            </div>
                            <span className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#1B4B43] transition-colors">{product.title}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="py-4 font-bold text-[#1A1A1A]">${product.price.toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Orders Tab */
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Активные заказы</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-[#F3F4F0] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ShoppingBag size={30} />
                </div>
                <p className="text-gray-500">Заказов пока нет</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-[24px] p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-[#1A1A1A]">Заказ #{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Новый' ? 'bg-blue-50 text-blue-500' : 
                            order.status === 'Выполнен' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-500'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-[#1B4B43]">${order.total.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Выполнен')}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                            title="Отметить как выполнен"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'В обработке')}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="В обработку"
                          >
                            <Clock size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Клиент</h4>
                        <p className="text-sm font-bold text-[#1A1A1A]">{order.customer.firstName} {order.customer.lastName}</p>
                        <p className="text-xs text-gray-500">{order.customer.phone}</p>
                        <p className="text-xs text-gray-500">{order.customer.address}, {order.customer.city}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Товары</h4>
                        <div className="space-y-1">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="text-xs flex justify-between">
                              <span className="text-gray-600">{item.title} <span className="text-gray-300">x{item.quantity}</span></span>
                              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
