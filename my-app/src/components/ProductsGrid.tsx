import React from "react";
import ProductCard from "../ui/ProductCard";

const products = [
  {
    id: 1,
    title: "Hydrating Face Cream",
    price: 1200,
    image: "/products/1.jpg",
  },
  {
    id: 2,
    title: "Vitamin C Serum",
    price: 1800,
    image: "/products/2.jpg",
  },
  {
    id: 3,
    title: "Gentle Cleanser",
    price: 900,
    image: "/products/3.jpg",
  },
  {
    id: 4,
    title: "Moisturizing Lotion",
    price: 1500,
    image: "/products/4.jpg",
  },
];

const ProductsGrid: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* header как в Figma */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl font-medium text-black">
            All Products
          </h2>

          <span className="text-sm text-black/50">
            Showing {products.length} products
          </span>
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              title={p.title}
              price={p.price}
              image={p.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductsGrid;