import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '../ui/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';
import { Search, X } from 'lucide-react';
import {
  PRODUCT_BRAND_FILTER_KEY,
  PRODUCT_CARE_TYPE_FILTER_KEY,
  PRODUCT_CATEGORY_FILTER_KEY,
  PRODUCT_SKIN_TYPE_FILTER_KEY,
  setProductBrandFilter,
  setProductCategoryFilter,
  setProductSkinTypeFilter,
  clearProductCatalogFilters,
  type ProductCareTypeFilter,
} from '../utils/scrollToSection';
import { careTypeLabel, productHasCareType } from '../data/productCareTypes';
import { filterStoreCategories } from '../data/storeCategories';
import { filterStoreBrands, brandNavItems, categoryNavDescriptions } from '../data/storeBrands';
import {
  isProductSkinType,
  productHasSkinType,
  skinTypeLabel,
  type ProductSkinType,
} from '../data/productSkinTypes';
import { useSearch } from '../contexts/SearchContext';
import CatalogPageHeader from './catalog/CatalogPageHeader';
import CatalogSidebar from './catalog/CatalogSidebar';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id?: number;
  brand_id?: number;
  brand_name?: string;
  care_type?: string;
  skin_type?: string;
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

const DEFAULT_CATALOG_DESCRIPTION =
  'Помогу подобрать профессиональный уход именно под ваш тип кожи. Напишите мне — и мы вместе составим план, с чего начать домашнюю заботу о себе.';

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedSkinType, setSelectedSkinType] = useState<ProductSkinType | null>(null);
  const [selectedCareType, setSelectedCareType] = useState<ProductCareTypeFilter | null>(null);
  const [sortBy, setSortBy] = useState('newest');
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

  const scrollToCatalogTop = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applyCategoryFilterByName = useCallback(
    (categoryName: string): boolean => {
      const cat = categories.find((c) => c.name === categoryName);
      if (cat) {
        setSelectedCategory(cat.id);
        setSelectedBrand(null);
        setSelectedSkinType(null);
        setSelectedCareType(null);
        return true;
      }
      return false;
    },
    [categories]
  );

  const applyBrandFilterByName = useCallback(
    (brandName: string): boolean => {
      const brand = brands.find((b) => b.name === brandName);
      if (brand) {
        setSelectedBrand(brand.id);
        setSelectedCategory(null);
        setSelectedSkinType(null);
        setSelectedCareType(null);
        return true;
      }
      return false;
    },
    [brands]
  );

  const selectCategory = (id: number | null) => {
    setSelectedCategory(id);
    setSelectedBrand(null);
    setSelectedSkinType(null);
    setSelectedCareType(null);
    sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
    if (id) {
      const name = categories.find((c) => c.id === id)?.name;
      setProductCategoryFilter(name ?? null);
      sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
    } else {
      clearProductCatalogFilters();
    }
    scrollToCatalogTop();
  };

  const selectBrand = (id: number | null) => {
    setSelectedBrand(id);
    setSelectedCategory(null);
    setSelectedSkinType(null);
    setSelectedCareType(null);
    if (id) {
      const name = brands.find((b) => b.id === id)?.name;
      setProductBrandFilter(name ?? null);
      sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
    } else {
      clearProductCatalogFilters();
    }
    scrollToCatalogTop();
  };

  const applySkinTypeFilter = useCallback((skinType: ProductSkinType) => {
    setSelectedSkinType(skinType);
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedCareType(null);
    sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
    sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
    sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
    setProductSkinTypeFilter(skinType);
  }, []);

  const selectSkinType = (value: ProductSkinType | null) => {
    if (value) {
      applySkinTypeFilter(value);
    } else {
      setSelectedSkinType(null);
      sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
    }
    scrollToCatalogTop();
  };

  const applyCareTypeFilter = useCallback((careType: ProductCareTypeFilter) => {
    setSelectedCareType(careType);
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedSkinType(null);
    clearProductCatalogFilters();
    sessionStorage.setItem(PRODUCT_CARE_TYPE_FILTER_KEY, careType);
  }, []);

  const showAllProducts = useCallback(() => {
    clearSearch();
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedSkinType(null);
    setSelectedCareType(null);
    clearProductCatalogFilters();
    scrollToCatalogTop();
  }, [clearSearch]);

  useEffect(() => {
    const storedCategory = sessionStorage.getItem(PRODUCT_CATEGORY_FILTER_KEY);
    const storedBrand = sessionStorage.getItem(PRODUCT_BRAND_FILTER_KEY);
    const storedCareType = sessionStorage.getItem(
      PRODUCT_CARE_TYPE_FILTER_KEY
    ) as ProductCareTypeFilter | null;
    const storedSkinType = sessionStorage.getItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
    if (storedBrand && brands.length > 0 && applyBrandFilterByName(storedBrand)) {
      sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
    } else if (storedCategory && categories.length > 0 && applyCategoryFilterByName(storedCategory)) {
      sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
    } else if (storedSkinType && isProductSkinType(storedSkinType)) {
      applySkinTypeFilter(storedSkinType);
      sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
    } else if (storedCareType === 'home' || storedCareType === 'professional') {
      applyCareTypeFilter(storedCareType);
      sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
    }
  }, [
    categories,
    brands,
    applyBrandFilterByName,
    applyCategoryFilterByName,
    applyCareTypeFilter,
    applySkinTypeFilter,
  ]);

  useEffect(() => {
    const onFilter = () => {
      const storedBrand = sessionStorage.getItem(PRODUCT_BRAND_FILTER_KEY);
      const storedCategory = sessionStorage.getItem(PRODUCT_CATEGORY_FILTER_KEY);
      const storedCareType = sessionStorage.getItem(
        PRODUCT_CARE_TYPE_FILTER_KEY
      ) as ProductCareTypeFilter | null;
      const storedSkinType = sessionStorage.getItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
      if (storedBrand && applyBrandFilterByName(storedBrand)) {
        sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
      } else if (storedCategory && applyCategoryFilterByName(storedCategory)) {
        sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
      } else if (storedSkinType && isProductSkinType(storedSkinType)) {
        applySkinTypeFilter(storedSkinType);
        sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
      } else if (storedCareType === 'home' || storedCareType === 'professional') {
        applyCareTypeFilter(storedCareType);
        sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
      } else {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setSelectedSkinType(null);
        setSelectedCareType(null);
      }
    };
    window.addEventListener('product-catalog-filter', onFilter);
    return () => window.removeEventListener('product-catalog-filter', onFilter);
  }, [
    categories,
    brands,
    applyBrandFilterByName,
    applyCategoryFilterByName,
    applyCareTypeFilter,
    applySkinTypeFilter,
  ]);

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
      result = result.filter((p) => p.brand_id === selectedBrand);
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category_id === selectedCategory);
    }
    if (selectedSkinType) {
      result = result.filter((p) => productHasSkinType(p.skin_type, selectedSkinType));
    }
    if (selectedCareType) {
      result = result.filter((p) => productHasCareType(p.care_type, selectedCareType));
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
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedSkinType, selectedCareType, sortBy]);

  const activeCategory = categories.find((c) => c.id === selectedCategory);
  const activeBrand = brands.find((b) => b.id === selectedBrand);

  const pageTitle = useMemo(() => {
    if (searchQuery && !activeCategory && !activeBrand && !selectedSkinType && !selectedCareType) {
      return 'Результаты поиска';
    }
    if (activeBrand) return activeBrand.name;
    if (activeCategory) return activeCategory.name;
    if (selectedCareType) return careTypeLabel(selectedCareType);
    if (selectedSkinType) return `Тип кожи: ${skinTypeLabel(selectedSkinType)}`;
    return 'Каталог';
  }, [searchQuery, activeCategory, activeBrand, selectedSkinType, selectedCareType]);

  const pageDescription = useMemo(() => {
    if (activeCategory) {
      return (
        categoryNavDescriptions[activeCategory.name] ||
        `Товары категории «${activeCategory.name}». ${DEFAULT_CATALOG_DESCRIPTION}`
      );
    }
    if (activeBrand) {
      const brandInfo = brandNavItems.find((b) => b.name === activeBrand.name);
      return brandInfo?.description
        ? `${brandInfo.description}. ${DEFAULT_CATALOG_DESCRIPTION}`
        : `Косметика бренда ${activeBrand.name}. ${DEFAULT_CATALOG_DESCRIPTION}`;
    }
    if (!searchQuery) return DEFAULT_CATALOG_DESCRIPTION;
    return undefined;
  }, [activeCategory, activeBrand, searchQuery]);

  const breadcrumbs = useMemo(() => {
    const items: { label: string; href?: string; onClick?: () => void }[] = [
      { label: 'Главная', href: '/' },
      { label: 'Каталог', onClick: showAllProducts },
    ];
    if (activeBrand) {
      items.push({ label: activeBrand.name });
    } else if (activeCategory) {
      items.push({ label: activeCategory.name });
    } else if (selectedCareType) {
      items.push({ label: careTypeLabel(selectedCareType) });
    } else if (selectedSkinType) {
      items.push({ label: skinTypeLabel(selectedSkinType) });
    } else if (searchQuery) {
      items.push({ label: 'Поиск' });
    }
    return items;
  }, [activeCategory, activeBrand, selectedSkinType, selectedCareType, searchQuery, showAllProducts]);

  const resetFilters = () => {
    clearSearch();
    selectCategory(null);
    setSortBy('newest');
  };

  const totalCount = filteredProducts.length;
  const displayRange =
    totalCount === 0 ? 'Товары не найдены' : `Отображение 1–${totalCount} из ${totalCount}`;

  return (
    <section id="products" className="scroll-mt-28 w-full bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <CatalogPageHeader
          breadcrumbs={breadcrumbs}
          title={pageTitle}
          description={pageDescription}
        />

        <form
          className="relative mb-8 max-w-xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            type="search"
            placeholder="Поиск по названию, описанию или категории..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43]/20 focus:border-[#1B4B43]"
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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">{displayRange}</p>
              <div className="flex items-center gap-2">
                <label htmlFor="catalog-sort" className="text-sm text-gray-500 whitespace-nowrap">
                  Сортировка:
                </label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] outline-none cursor-pointer hover:border-gray-300 min-w-[180px]"
                >
                  <option value="newest">По новизне</option>
                  <option value="price-low">Цена: по возрастанию</option>
                  <option value="price-high">Цена: по убыванию</option>
                  <option value="name">По названию</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[320px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4B43]" />
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image_url: p.image_url,
                      category_name: p.category_name,
                      care_type: p.care_type,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🔍</div>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">Товары не найдены</h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    Попробуйте другую категорию, бренд или измените поиск
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-2 px-6 py-3 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all text-sm"
                  >
                    Показать весь каталог
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <CatalogSidebar
              categories={categories}
              brands={brands}
              selectedCategoryId={selectedCategory}
              selectedBrandId={selectedBrand}
              selectedSkinType={selectedSkinType}
              selectedCareType={selectedCareType}
              onSelectCategory={selectCategory}
              onSelectBrand={selectBrand}
              onSelectSkinType={selectSkinType}
              onShowAll={showAllProducts}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
