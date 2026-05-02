import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { ShoppingBag, Heart } from "lucide-react";

type ProductCardProps = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  oldPrice?: number;
  badge?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  price,
  rating,
  image,
  oldPrice,
  badge,
}) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, image, oldPrice, category, rating, badge });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ id, title, price, image, oldPrice, category, rating, badge });
    }
  };

  return (
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

        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md transition-all hover:scale-105 hover:text-[#B33A3A]"
          aria-label={isFavorite(id) ? "Убрать из избранного" : "Добавить в избранное"}
        >
          <Heart
            size={18}
            className={isFavorite(id) ? "fill-current text-[#B33A3A]" : ""}
          />
        </button>

        <Link to={`/product/${id}`} className="block h-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 z-10 bg-white text-[#1A1A1A] py-3 rounded-xl shadow-xl opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#1B4B43] hover:text-white"
        >
          <ShoppingBag size={16} />
          В корзину
        </button>
      </div>

      {/* content */}
      <Link to={`/product/${id}`} className="flex flex-col gap-1 px-1">
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
          <span className="text-base font-bold text-[#1A1A1A]">${typeof price === 'number' ? price.toFixed(2) : Number(price).toFixed(2)}</span>
          {oldPrice && (
            <span className="text-xs text-[#A0A0A0] line-through">
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
