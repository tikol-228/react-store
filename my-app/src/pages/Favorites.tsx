import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatPrice } from '../utils/formatPrice';
import { goToProductsCatalog } from '../utils/scrollToSection';
import CareTypeBadge from '../components/CareTypeBadge';

const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
  };

  const handleAddToCart = async (productId: string | number) => {
    try {
      await addToCart(Number(productId));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось добавить в корзину';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={32} className="text-red-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A]">Избранное</h1>
          </div>
          <p className="text-gray-500">Ваши любимые товары ({favorites.length})</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={40} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">В избранном пока пусто</h2>
            <p className="text-gray-400 mb-6">Добавляйте товары в избранное, чтобы не потерять их</p>
            <button
              type="button"
              onClick={() => goToProductsCatalog()}
              className="inline-flex items-center gap-2 bg-[#1B4B43] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2a6b5f] transition-all"
            >
              <ShoppingBag size={18} />
              Перейти к покупкам
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <CareTypeBadge careType={product.care_type} className="absolute top-3 left-3 z-10" />
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
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromFavorites(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Убрать из избранного"
                  >
                    <Heart size={16} className="fill-current" />
                  </button>
                </Link>

                <div className="p-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="block font-bold text-[#1A1A1A] mb-2 mt-1 line-clamp-2 group-hover:text-[#1B4B43] transition-colors"
                  >
                    {product.title}
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-[#1B4B43]">{formatPrice(product.price)}</span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-[#1B4B43] text-white p-2 rounded-lg hover:bg-[#2a6b5f] transition-colors"
                      aria-label="Добавить в корзину"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
