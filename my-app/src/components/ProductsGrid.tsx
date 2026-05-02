import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../ui/ProductCard";
import { initialProducts } from "../data/products";
import type { Product } from "../data/products";
import { Search, ChevronDown, X } from "lucide-react";

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category));
    return Array.from(cats);
  }, []);

  // Get price range
  const maxPrice = useMemo(() => {
    return Math.max(...initialProducts.map(p => p.price)) + 10;
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, maxPrice]);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <section className="w-full bg-white py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="space-y-1 sm:space-y-2">
              <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">Наша коллекция</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-[#1A1A1A]">
                Все товары
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Найдено товаров:</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1B4B43]">{filteredProducts.length}</p>
            </div>
          </div>

          {/* Search Bar */}
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

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-200 rounded-full text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                Фильтры
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {hasActiveFilters && (
                <button
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
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Категории</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Все категории</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Цена</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      От: <span className="font-bold text-[#1A1A1A]">${priceRange[0]}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4B43]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      До: <span className="font-bold text-[#1A1A1A]">${priceRange[1]}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4B43]"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Информация</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><span className="font-semibold text-[#1A1A1A]">{filteredProducts.length}</span> товаров найдено</p>
                  <p className="text-xs">Используйте фильтры для уточнения поиска</p>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Средний рейтинг:</p>
                    <p className="font-semibold text-[#1A1A1A]">
                      {filteredProducts.length > 0
                        ? (filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length).toFixed(1)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                category={p.category}
                price={p.price}
                rating={p.rating}
                image={p.image}
                oldPrice={p.oldPrice}
                badge={p.badge}
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