type CatalogItem = {
  id: number;
  name: string;
};

type CatalogSidebarProps = {
  categories: CatalogItem[];
  brands: CatalogItem[];
  selectedCategoryId: number | null;
  selectedBrandId: number | null;
  onSelectCategory: (id: number | null) => void;
  onSelectBrand: (id: number | null) => void;
};

const linkClass = (active: boolean) =>
  `block w-full text-left py-2 text-sm transition-colors ${
    active
      ? 'font-bold text-[#1A1A1A]'
      : 'text-gray-600 hover:text-[#1B4B43] font-normal'
  }`;

const CatalogSidebar = ({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  onSelectCategory,
  onSelectBrand,
}: CatalogSidebarProps) => (
  <aside className="w-full lg:w-[260px] shrink-0">
    <div className="lg:sticky lg:top-28 space-y-8">
      <div>
        <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">
          Категории
        </h2>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={linkClass(selectedCategoryId === null && selectedBrandId === null)}
            >
              Все товары
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={linkClass(selectedCategoryId === cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {brands.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">
            Бренды
          </h2>
          <ul className="space-y-0.5">
            {brands.map((brand) => (
              <li key={brand.id}>
                <button
                  type="button"
                  onClick={() => onSelectBrand(brand.id)}
                  className={linkClass(selectedBrandId === brand.id)}
                >
                  {brand.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </aside>
);

export default CatalogSidebar;
