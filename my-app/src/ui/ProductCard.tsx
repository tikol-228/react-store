import React from "react";
import { useCart } from "../contexts/CartContext";
import { ShoppingBag } from "lucide-react";

type ProductCardProps = {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  image: string;
<<<<<<< HEAD
  oldPrice?: number;
  category: string;
  rating: number;
  badge?: string;
=======
  isNew?: boolean;
>>>>>>> c09282e0a734d5648a4c63fb54911e75197f25d8
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  price,
  rating,
  image,
<<<<<<< HEAD
  oldPrice,
  category,
  rating,
  badge,
=======
  isNew,
>>>>>>> c09282e0a734d5648a4c63fb54911e75197f25d8
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, image, oldPrice, category, rating, badge });
  };

  return (
<<<<<<< HEAD
    <div className="group flex flex-col relative">
      {/* image container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F6F6] mb-4 rounded-2xl">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
              badge === 'Новинка' ? 'bg-[#1B4B43] text-white' : 
              badge.includes('%') ? 'bg-[#D19D6B] text-white' : 
              'bg-[#1B4B43] text-white'
            }`}>
              {badge}
            </span>
          </div>
        )}
        
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Add Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 bg-white text-[#1A1A1A] py-3 rounded-xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#1B4B43] hover:text-white"
        >
          <ShoppingBag size={16} />
          В корзину
        </button>
      </div>

      {/* content */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#A0A0A0] uppercase tracking-wider font-medium">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-orange-400 text-xs">★</span>
            <span className="text-[11px] font-bold text-black">{rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-[14px] font-medium text-[#1A1A1A] leading-snug min-h-[40px] group-hover:text-[#1B4B43] transition-colors">
          {title}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-bold text-[#1A1A1A]">${price.toFixed(2)}</span>
          {oldPrice && (
            <span className="text-xs text-[#A0A0A0] line-through">
              ${oldPrice.toFixed(2)}
            </span>
          )}
=======
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
>>>>>>> c09282e0a734d5648a4c63fb54911e75197f25d8
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