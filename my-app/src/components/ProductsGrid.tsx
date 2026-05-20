import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../ui/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';
import { Search, ChevronDown, X } from 'lucide-react';
import { PRODUCT_BRAND_FILTER_KEY, PRODUCT_CATEGORY_FILTER_KEY } from '../utils/scrollToSection';
import { filterStoreCategories } from '../data/storeCategories';
import { filterStoreBrands } from '../data/storeBrands';
import { useSearch } from '../contexts/SearchContext';

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
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Category[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [productsResult, categoriesResult, brandsResult] = await Promise.allSettled([
        productsAPI.getProducts({ limit: 200 }),
        categoriesAPI.getCategories(),
        categoriesAPI.getBrands(),
      ]);

      if (productsResult.status === 'fulfilled') {
        setProducts(productsResult.value.data.products || []);
      } else {
        setProducts([]);
        console.error('Failed to load products:', productsResult.reason);
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(filterStoreCategories(categoriesResult.value.data.categories || []));
      } else {
        setCategories([]);
        console.error('Failed to load categories:', categoriesResult.reason);
      }

      if (brandsResult.status === 'fulfilled') {
        setBrands(filterStoreBrands(brandsResult.value.data.brands || []));
      } else {
        setBrands([]);
        console.error('Failed to load brands:', brandsResult.reason);
      }

      if (productsResult.status !== 'fulfilled') {
        const reason = productsResult.reason as { code?: string; message?: string };
        if (reason?.code === 'ECONNABORTED') {
          setLoadError('Сервер не отвечает. Запустите API: npm run start');
        } else if (reason?.code === 'ERR_NETWORK') {
          setLoadError('Нет связи с сервером. Запустите API: npm run start');
        } else {
          setLoadError('Не удалось загрузить товары. Проверьте, что API запущен.');
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoadError('Не удалось загрузить каталог.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyCategoryFilterByName = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    if (cat) {
      setSelectedCategory(cat.id);
      setSelectedBrand(null);
    }
  };

  const applyBrandFilterByName = (brandName: string) => {
    const brand = brands.find((b) => b.name === brandName);
    if (brand) {
      setSelectedBrand(brand.id);
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    const storedCategory = sessionStorage.getItem(PRODUCT_CATEGORY_FILTER_KEY);
    const storedBrand = sessionStorage.getItem(PRODUCT_BRAND_FILTER_KEY);
    if (storedBrand && brands.length > 0) {
      applyBrandFilterByName(storedBrand);
      sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
    } else if (storedCategory && categories.length > 0) {
      applyCategoryFilterByName(storedCategory);
      sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
    }
  }, [categories, brands]);

  useEffect(() => {
    const onFilter = () => {
      const storedBrand = sessionStorage.getItem(PRODUCT_BRAND_FILTER_KEY);
      const storedCategory = sessionStorage.getItem(PRODUCT_CATEGORY_FILTER_KEY);
      if (storedBrand) {
        applyBrandFilterByName(storedBrand);
        sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
      } else if (storedCategory) {
        applyCategoryFilterByName(storedCategory);
        sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
      } else {
        setSelectedCategory(null);
        setSelectedBrand(null);
      }
    };
    window.addEventListener('product-catalog-filter', onFilter);
    return () => window.removeEventListener('product-catalog-filter', onFilter);
  }, [categories, brands]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category_name || '').toLowerCase().includes(q)
      );
    }

    if (selectedBrand) {
      result = result.filter((p) => p.category_id === selectedBrand);
    } else if (selectedCategory) {
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
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const resetFilters = () => {
    clearSearch();
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSortBy('newest');
  };

  const hasActiveFilters =
    Boolean(searchQuery) || selectedCategory !== null || selectedBrand !== null;

  return (
    <section id="products" className="scroll-mt-28 w-full bg-white py-12 sm:py-24">
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

          <form
            className="relative mb-4 sm:mb-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="search"
              placeholder="Поиск по названию, описанию или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
              aria-label="Поиск товаров"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => clearSearch()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label="Очистить поиск"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className="relative"
                onMouseEnter={() => setCategoryMenuOpen(true)}
                onMouseLeave={() => setCategoryMenuOpen(false)}
              >
                <button
                  type="button"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-200 rounded-full text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name ?? 'Категории'
                    : 'Категории'}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {categoryMenuOpen && (
                  <div className="absolute left-0 top-full z-40 pt-2 min-w-[220px]">
                    <div className="rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-72 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedBrand(null);
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                          selectedCategory === null
                            ? 'font-semibold text-[#1B4B43] bg-[#1B4B43]/5'
                            : 'text-gray-800'
                        }`}
                      >
                        Все категории
                      </button>
                      {categories.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                          setSelectedCategory(c.id);
                          setSelectedBrand(null);
                        }}
                          className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                            selectedCategory === c.id
                              ? 'font-semibold text-[#1B4B43] bg-[#1B4B43]/5'
                              : 'text-gray-800'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setBrandMenuOpen(true)}
                onMouseLeave={() => setBrandMenuOpen(false)}
              >
                <button
                  type="button"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-200 rounded-full text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  {selectedBrand
                    ? brands.find((b) => b.id === selectedBrand)?.name ?? 'Бренды'
                    : 'Бренды'}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${brandMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {brandMenuOpen && (
                  <div className="absolute left-0 top-full z-40 pt-2 min-w-[240px]">
                    <div className="rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-72 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBrand(null);
                          setSelectedCategory(null);
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                          selectedBrand === null
                            ? 'font-semibold text-[#1B4B43] bg-[#1B4B43]/5'
                            : 'text-gray-800'
                        }`}
                      >
                        Все бренды
                      </button>
                      {brands.map((b) => (
                        <button
                          type="button"
                          key={b.id}
                          onClick={() => {
                            setSelectedBrand(b.id);
                            setSelectedCategory(null);
                          }}
                          className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                            selectedBrand === b.id
                              ? 'font-semibold text-[#1B4B43] bg-[#1B4B43]/5'
                              : 'text-gray-800'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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

        {loading ? (
          <div className="flex justify-center items-center min-h-[320px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4B43]" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <p className="text-gray-600 mb-4 max-w-md">{loadError}</p>
            <button
              type="button"
              onClick={loadData}
              className="px-6 py-3 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all"
            >
              Повторить
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
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
