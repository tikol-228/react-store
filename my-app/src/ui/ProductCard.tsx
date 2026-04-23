import React from "react";

type ProductCardProps = {
  title: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  isNew?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  category,
  price,
  rating,
  image,
  isNew,
}) => {
  return (
    <div className="w-[306px] rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="relative flex items-center justify-center bg-gray-100 rounded-xl h-[220px] mb-4">
        {isNew && (
          <span className="absolute top-3 left-3 bg-green-800 text-white text-xs px-3 py-1 rounded-full">
            New
          </span>
        )}
        <img src={image} alt={title} className="h-32 object-contain" />
      </div>

      {/* Category + Rating */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span>{category}</span>
        <div className="flex items-center gap-1 text-orange-500">
          <span>★</span>
          <span className="text-gray-700">{rating}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2">
        {title}
      </h3>

      {/* Price */}
      <div className="text-lg font-semibold text-gray-900">{price}</div>
    </div>
  );
};

export default ProductCard;