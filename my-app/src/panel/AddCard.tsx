import React, { useState, useEffect } from 'react';
import { initialProducts } from '../data/products';
import type { Product } from '../data/products';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

const AddCard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    price: 0,
    category: '',
    rating: 5.0,
    badge: '',
    image: '',
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
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
    
    alert('Товар успешно добавлен!');
    setNewProduct({
      title: '',
      price: 0,
      category: '',
      rating: 5.0,
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

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/panel" className="inline-flex items-center gap-2 text-[#1B4B43] hover:text-black transition-colors mb-4">
            <ArrowLeft size={20} />
            <span className="font-bold">Вернуться в панель</span>
          </Link>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Добавление товара</h1>
          <p className="text-gray-400">Быстро добавьте новый товар в каталог</p>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus size={20} className="text-[#1B4B43]" />
            Новый товар
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Название товара *</label>
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  placeholder="Введите название товара"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Цена ($) *</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  placeholder="0.00"
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
                  placeholder="Например: Картины"
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
                  placeholder="5.0"
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
                  placeholder="Опционально"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Фото товара *</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1B4B43] file:text-white hover:file:bg-[#2a6b5f] transition-all cursor-pointer"
                  required
                />
                {newProduct.image && (
                  <div className="h-20 w-20 bg-[#F6F6F6] rounded-xl overflow-hidden border-2 border-[#1B4B43]/10">
                    <img src={newProduct.image} alt="Preview" className="h-full w-full object-contain p-2" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-white py-4 px-4 rounded-xl hover:bg-black transition duration-300 font-bold shadow-lg mt-8"
            >
              Добавить товар в каталог
            </button>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Текущий каталог ({products.length} товаров)</h2>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Товаров в каталоге не найдено</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Товар</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Категория</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Цена</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Рейтинг</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="group hover:bg-[#FAF9F6]/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-[#F6F6F6] rounded-xl overflow-hidden p-1 flex-shrink-0">
                            <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#1A1A1A]">{product.title}</span>
                            {product.badge && <div className="text-xs text-gray-400">{product.badge}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-500">{product.category}</td>
                      <td className="py-4 font-bold text-[#1A1A1A]">${product.price.toFixed(2)}</td>
                      <td className="py-4 text-sm text-gray-500">★ {product.rating.toFixed(1)}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Удалить товар"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCard;