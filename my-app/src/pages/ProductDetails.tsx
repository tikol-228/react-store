import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatPrice } from '../utils/formatPrice';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      try {
        const response = await productsAPI.getProduct(parseInt(id, 10));
        setProduct(response.data.product);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B4B43]/20 border-t-[#1B4B43] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/" replace />;
  }

  const favorite = isFavorite(product.id);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(product.id);
      return;
    }

    addToFavorites({
      id: product.id,
      title: product.name,
      category: product.category_name || 'Категория',
      price: product.price,
      rating: product.rating || 4.5,
      image: product.image_url || '/placeholder-product.jpg',
    });
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
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D19D6B]">
              {product.category_name || 'Категория'}
            </span>
            <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-400">
                <Star size={18} className="fill-current" />
                <span className="font-semibold text-[#1A1A1A]">{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#1A1A1A]">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-600">
              {product.description || 'Описание товара временно отсутствует.'}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await addToCart(product.id);
                  } catch (err: any) {
                    alert(err?.message || 'Не удалось добавить в корзину');
                  }
                }}
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
