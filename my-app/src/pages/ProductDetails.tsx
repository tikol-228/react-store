import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { initialProducts } from '../data/products';
import type { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const product = useMemo(() => {
    const savedProducts = localStorage.getItem('products');
    const products: Product[] = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    return products.find((item) => item.id === id);
  }, [id]);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const favorite = isFavorite(product.id);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(product.id);
      return;
    }

    addToFavorites(product);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#1B4B43]"
        >
          <ArrowLeft size={18} />
          Вернуться к каталогу
        </Link>

        <section className="grid grid-cols-1 gap-6 rounded-[32px] border border-gray-100 bg-white p-4 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-[28px] bg-[#F6F6F6] p-6">
            <div className="aspect-[4/5] overflow-hidden rounded-[24px]">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D19D6B]">
              {product.category}
            </span>
            <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              {product.title}
            </h1>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-400">
                <Star size={18} className="fill-current" />
                <span className="font-semibold text-[#1A1A1A]">{product.rating.toFixed(1)}</span>
              </div>
              {product.badge && (
                <span className="rounded-full bg-[#1B4B43] px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="mb-8 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#1A1A1A]">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-600">
              Профессионально подобранный товар для ухода и поддержания красоты. Добавьте его в
              корзину или сохраните в избранное, чтобы вернуться позже.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B4B43] px-8 py-4 font-bold text-white transition-colors hover:bg-[#245c53]"
              >
                <ShoppingBag size={18} />
                Добавить в корзину
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 font-bold text-[#1A1A1A] transition-colors hover:border-[#1B4B43] hover:text-[#1B4B43]"
              >
                <Heart size={18} className={favorite ? 'fill-current text-[#B33A3A]' : ''} />
                {favorite ? 'Убрать из избранного' : 'В избранное'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
