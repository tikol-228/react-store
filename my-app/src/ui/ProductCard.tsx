import React from "react";

type ProductCardProps = {
  title: string;
  price: number;
  image: string;
  oldPrice?: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  oldPrice,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      
      {/* image */}
      <div className="w-full h-56 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* content */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-black">{title}</h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-black font-semibold">{price} ₽</span>

          {oldPrice && (
            <span className="text-sm text-black/40 line-through">
              {oldPrice} ₽
            </span>
          )}
        </div>

        <button className="mt-4 w-full py-2 bg-black text-white text-sm rounded-md hover:opacity-90 transition">
          В корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;