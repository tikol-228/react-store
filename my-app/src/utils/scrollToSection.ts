const HEADER_OFFSET = 100;

export const PRODUCT_CATEGORY_FILTER_KEY = 'react-store-product-category';
export const PRODUCT_BRAND_FILTER_KEY = 'react-store-product-brand';
export const PRODUCT_CARE_TYPE_FILTER_KEY = 'react-store-product-care-type';
export const PRODUCT_SKIN_TYPE_FILTER_KEY = 'react-store-product-skin-type';

export type ProductCareTypeFilter = 'home' | 'professional';

export function setProductCategoryFilter(categoryName: string | null) {
  if (categoryName) {
    sessionStorage.setItem(PRODUCT_CATEGORY_FILTER_KEY, categoryName);
  } else {
    sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
  }
}

export function setProductBrandFilter(brandName: string | null) {
  if (brandName) {
    sessionStorage.setItem(PRODUCT_BRAND_FILTER_KEY, brandName);
  } else {
    sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
  }
}

export function setProductCareTypeFilter(careType: ProductCareTypeFilter | null) {
  if (careType) {
    sessionStorage.setItem(PRODUCT_CARE_TYPE_FILTER_KEY, careType);
  } else {
    sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
  }
}

export function setProductSkinTypeFilter(skinType: string | null) {
  if (skinType) {
    sessionStorage.setItem(PRODUCT_SKIN_TYPE_FILTER_KEY, skinType);
  } else {
    sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
  }
}

export function clearProductCatalogFilters() {
  sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
  sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
  sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
  sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
}

function scrollToElement(sectionId: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const el = document.getElementById(sectionId);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

/** Скролл к каталогу; повторяет попытку, пока секция не смонтирована (после перехода на главную). */
export function goToProductsCatalog(behavior: ScrollBehavior = 'smooth') {
  clearProductCatalogFilters();
  window.dispatchEvent(new CustomEvent('product-catalog-filter'));

  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    window.history.replaceState(null, '', '#products');
  }

  if (scrollToElement('products', behavior)) return;

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (scrollToElement('products', behavior) || attempts >= 30) {
      clearInterval(timer);
    }
  }, 100);
}

export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = 'smooth',
  categoryName?: string | null,
  brandName?: string | null,
  careType?: ProductCareTypeFilter | null
) {
  if (sectionId === 'products') {
    if (brandName) {
      setProductBrandFilter(brandName);
      sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
      sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
      sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
      window.dispatchEvent(new CustomEvent('product-catalog-filter'));
      scrollToElement('products', behavior);
      return;
    }
    if (categoryName) {
      setProductCategoryFilter(categoryName);
      sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
      sessionStorage.removeItem(PRODUCT_CARE_TYPE_FILTER_KEY);
      sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
      window.dispatchEvent(new CustomEvent('product-catalog-filter'));
      scrollToElement('products', behavior);
      return;
    }
    if (careType) {
      setProductCareTypeFilter(careType);
      sessionStorage.removeItem(PRODUCT_CATEGORY_FILTER_KEY);
      sessionStorage.removeItem(PRODUCT_BRAND_FILTER_KEY);
      sessionStorage.removeItem(PRODUCT_SKIN_TYPE_FILTER_KEY);
      window.dispatchEvent(new CustomEvent('product-catalog-filter'));
      scrollToElement('products', behavior);
      return;
    }
    goToProductsCatalog(behavior);
    return;
  }
  if (sectionId === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  scrollToElement(sectionId, behavior);
}

export function scrollToSectionFromHash(hash: string) {
  const id = hash.replace(/^#/, '').trim();
  if (!id) return;
  requestAnimationFrame(() => {
    if (id === 'products') {
      goToProductsCatalog();
      return;
    }
    setTimeout(() => scrollToSection(id), 50);
  });
}
