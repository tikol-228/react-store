import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { goToProductsCatalog, scrollToSection, scrollToSectionFromHash } from '../utils/scrollToSection'
import Footer from '../components/Footer'
import ProductsGrid from '../components/ProductsGrid'
import BookAppointmentButton from '../components/BookAppointmentButton'

const FACE_CARE_IMG =
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=900'
const BODY_CARE_IMG =
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=900'
const FACE_CARE_FALLBACK =
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=900'

const categoryBanners = [
  { name: 'Уход за лицом', img: FACE_CARE_IMG, fallback: FACE_CARE_FALLBACK },
  { name: 'Уход за телом', img: BODY_CARE_IMG, fallback: BODY_CARE_IMG },
] as const

const Home = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      scrollToSectionFromHash(location.hash)
      return
    }
    if ((location.state as { scrollToProducts?: boolean } | null)?.scrollToProducts) {
      goToProductsCatalog()
      return
    }
    const q = new URLSearchParams(location.search).get('q')
    if (q) {
      goToProductsCatalog()
      window.history.replaceState(null, '', `/?q=${encodeURIComponent(q)}#products`)
    }
  }, [location.hash, location.search, location.state])

  return (
    <>
    <div id="top" className="bg-[#FAF9F6]">
      <Header />

      {/* Главный экран — знакомство с Юлей */}
      <section id="about" className="py-12 sm:py-24 overflow-hidden scroll-mt-28">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-2xl sm:rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="/IMG_0254.PNG" 
                alt="Юлия Зубкевич - косметик-эстетист" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 sm:-bottom-10 -right-4 sm:-right-10 bg-[#1B4B43] p-4 sm:p-8 rounded-2xl sm:rounded-[30px] text-white max-w-[200px] sm:max-w-xs shadow-lg">
              <p className="text-sm sm:text-xl font-serif italic mb-1 sm:mb-2 leading-snug">
                Показать эстетическое омоложение без единого укола
              </p>
              <p className="text-[10px] sm:text-sm opacity-70">— Моя цель</p>
            </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div className="space-y-2 sm:space-y-4">
              <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">Давайте знакомиться!</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-[#1A1A1A] leading-tight">
                Юлия <br />
                Зубкевич
              </h1>
            </div>
            
            <div className="content-text space-y-3 sm:space-y-4 text-gray-600">
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                Я косметик-эстетист с высшим спортивным образованием. Более 13 лет я дарю красоту и здоровье коже, это годы практики, обучения и любви к профессии.
              </p>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                Я не предлагаю процедуры «на один-два раза», я не навязываю лишнее. Я предлагаю стратегии ухода и только то, что будет работать как актив, чтобы результат накапливался и усиливал вашу природную красоту.
              </p>
            </div>

            <div className="content-text space-y-4">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Что я делаю для вашей красоты:</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#1A1A1A]">
                  <span className="text-[#D19D6B] text-xl mt-1 flex-shrink-0">✅</span>
                  <div className="space-y-1">
                    <p className="font-semibold">Массаж лица</p>
                    <p className="text-sm text-gray-600">Это мощная работа с тканями, которая запускает естественные процессы омоложения.</p>
                    <p className="text-sm text-gray-600">Мои техники — это точность, глубина и результат, который видно в зеркале.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[#1A1A1A]">
                  <span className="text-[#D19D6B] text-xl mt-1 flex-shrink-0">✅</span>
                  <div className="space-y-1">
                    <p className="font-semibold">Подбор домашнего ухода</p>
                    <p className="text-sm text-gray-600">Составлю персональный маршрут ухода специально для вас, который работает 24/7.</p>
                    <p className="text-sm text-gray-600">Без хаоса, без случайных покупок, без разочарований.</p>
                    <p className="text-sm text-gray-600">Только активы, которые усиливают вашу природную красоту день за днём.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="content-text space-y-3">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Мои достижения — ваша гарантия результата:</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">🏆</span>
                  <span>
                    Победитель международного чемпионата в Риме (2026 год) в категории «Эстетический массаж» — это высокое признание на международном уровне (итальянцы знают толк в красоте, и для меня это большая честь).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D19D6B] flex-shrink-0">—</span>
                  <span>Участница чемпионата по массажу в Минске (2013), приз за художественное исполнение.</span>
                </li>
              </ul>
            </div>

            <div className="content-text space-y-4">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Вы пришли по адресу, если:</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#D19D6B]">—</span> Не знаете, с чего начать
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D19D6B]">—</span> Потерялись среди советов и брендов
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D19D6B]">—</span> Хотите результат, но против инъекций
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D19D6B]">—</span> Желаете получить стратегию ухода на долгий период
                </li>
              </ul>
            </div>

            <p className="text-base sm:text-lg font-medium text-[#1B4B43]">
              Забота о сложном — моя задача и это просто!
            </p>

            <BookAppointmentButton className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-black transition-all text-sm sm:text-base">
              Записаться на консультацию
            </BookAppointmentButton>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-12 sm:py-20 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8">
            {categoryBanners.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => scrollToSection('products', 'smooth', cat.name)}
                className="group relative aspect-[4/5] rounded-2xl sm:rounded-[30px] overflow-hidden cursor-pointer text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4B43] focus-visible:ring-offset-2"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (el.src !== cat.fallback) el.src = cat.fallback
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-8 text-white">
                  <h3 className="text-lg sm:text-2xl font-bold">{cat.name}</h3>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    Смотреть каталог →
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <ProductsGrid />

      <Footer />
    </div>
    </>
  )
}

export default Home
