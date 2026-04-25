import React, { useState, useEffect } from "react";
import ProductCard from "../ui/ProductCard";
import { initialProducts } from "../data/products";
import type { Product } from "../data/products";

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  return (
    <section className="w-full bg-[#FAF9F6] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* header */}
        <div className="flex items-center justify-between mb-16">
          <div className="space-y-2">
            <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">Наша коллекция</span>
            <h2 className="text-[40px] font-medium text-[#1A1A1A]">
              Все товары
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <select className="bg-transparent border-none text-sm font-bold text-[#1A1A1A] outline-none cursor-pointer">
              <option>Сначала новые</option>
              <option>Цена: по возрастанию</option>
              <option>Цена: по убыванию</option>
            </select>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <button className="px-6 py-3 border border-gray-200 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-white transition-all">
              Фильтр
            </button>
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              title={p.title}
              price={p.price}
              image={p.image}
              category={p.category}
              rating={p.rating}
              badge={p.badge}
              oldPrice={p.oldPrice}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductsGrid;