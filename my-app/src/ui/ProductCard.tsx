import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    category_name?: string;
    price: number;
    rating?: number;
    image_url?: string;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error?.message || 'Не удалось добавить в корзину');
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: String(product.id),
        title: product.name,
        category: product.category_name || 'Категория',
        price: product.price,
        rating: product.rating ?? 4.5,
        image: product.image_url || '/placeholder-product.jpg',
      });
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F6F6] mb-4 rounded-2xl">
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md transition-all hover:scale-105 hover:text-[#B33A3A]"
          aria-label={isFavorite(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Heart size={18} className={isFavorite(product.id) ? 'fill-current text-[#B33A3A]' : ''} />
        </button>

        <img
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />

        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 z-10 bg-white text-[#1A1A1A] py-3 rounded-xl shadow-xl opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#1B4B43] hover:text-white"
        >
          <ShoppingBag size={16} />
          В корзину
        </button>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#A0A0A0] uppercase tracking-wider font-medium">
            {product.category_name || 'Категория'}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-orange-400 text-xs">★</span>
            <span className="text-[11px] font-bold text-black">{(product.rating ?? 4.5).toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-[14px] font-medium text-[#1A1A1A] leading-snug min-h-[40px] group-hover:text-[#1B4B43] transition-colors">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-bold text-[#1A1A1A]">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
