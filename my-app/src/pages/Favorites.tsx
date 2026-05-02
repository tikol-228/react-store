import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={32} className="text-red-500" />
            <h1 className="text-4xl font-bold text-[#1A1A1A]">Избранное</h1>
          </div>
          <p className="text-gray-400">Ваши любимые товары ({favorites.length})</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={40} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">В избранном пока пусто</h2>
            <p className="text-gray-400 mb-6">Добавляйте товары в избранное, чтобы не потерять их</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#1B4B43] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2a6b5f] transition-all"
            >
              <ShoppingBag size={18} />
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#1B4B43] text-white px-2 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromFavorites(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Heart size={16} className="fill-current" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#1B4B43] transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.rating})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#1B4B43]">
                      {product.price} ₽
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#1B4B43] text-white p-2 rounded-lg hover:bg-[#2a6b5f] transition-colors"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
