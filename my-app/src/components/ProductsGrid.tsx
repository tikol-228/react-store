import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../ui/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';
import { Search, ChevronDown, X } from 'lucide-react';

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

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getProducts({ limit: 200 }),
          categoriesAPI.getCategories(),
        ]);
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('newest');
  };

  const hasActiveFilters = Boolean(searchQuery) || selectedCategory !== null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4B43]" />
      </div>
    );
  }

  return (
    <section id="products" className="w-full bg-white py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="space-y-1 sm:space-y-2">
              <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">Наша коллекция</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-[#1A1A1A]">Все товары</h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Найдено товаров:</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1B4B43]">{filteredProducts.length}</p>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-200 rounded-full text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                Фильтры
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#1B4B43] hover:text-[#2a6b5f] flex items-center gap-2 transition-colors"
                >
                  Очистить
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] outline-none cursor-pointer hover:border-gray-300 transition-all flex-1 sm:flex-none"
              >
                <option value="newest">Сначала новые</option>
                <option value="price-low">Цена: по возрастанию</option>
                <option value="price-high">Цена: по убыванию</option>
                <option value="name">По названию</option>
              </select>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === null ? 'bg-[#1B4B43] text-white' : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                Все категории
              </button>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === c.id ? 'bg-[#1B4B43] text-white' : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image_url: p.image_url,
                  category_name: p.category_name,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="text-center space-y-4">
              <div className="text-4xl sm:text-5xl">🔍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Товары не найдены</h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md px-4">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-6 py-3 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all text-sm sm:text-base"
              >
                Очистить фильтры
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;
