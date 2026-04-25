import Header from '../components/Header'
import SubFooter from '../components/SubFooter'
import plane from '../icons/plane.svg'
import returnIcon from '../icons/returnIcon.svg'
import secure from '../icons/secure.svg'
import support from '../icons/support.svg'
import Footer from '../components/Footer'
import ProductsGrid from '../components/ProductsGrid'

const Home = () => {
  return (
    <>
    <div className="bg-[#FAF9F6]">
      <Header />
      
      {/* Featured Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">Изучайте</span>
              <h2 className="text-4xl font-medium text-[#1A1A1A]">По категориям</h2>
            </div>
            <button className="text-sm font-bold text-[#1B4B43] border-b-2 border-[#1B4B43] pb-1 hover:text-[#2a6b5f] hover:border-[#2a6b5f] transition-all">
              Все категории
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Уход за лицом', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400', count: 24 },
              { name: 'Уход за телом', img: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=400', count: 18 },
              { name: 'Аксессуары', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400', count: 12 },
            ].map((cat) => (
              <div key={cat.name} className="group relative aspect-[4/5] rounded-[30px] overflow-hidden cursor-pointer">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <p className="text-sm font-medium opacity-80">{cat.count} Товаров</p>
                  <h3 className="text-2xl font-bold">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <SubFooter
            icon={<div className="p-4 bg-[#F3F4F0] rounded-2xl"><img src={plane} alt="самолёт" className="w-8 h-8" /></div>}
            title="Бесплатная доставка"
            desc="На все заказы от $50"
          />
          <SubFooter
            icon={<div className="p-4 bg-[#F3F4F0] rounded-2xl"><img src={returnIcon} alt="возврат" className="w-8 h-8" /></div>}
            title="30 дней на возврат"
            desc="Гарантия возврата денег"
          />
          <SubFooter
            icon={<div className="p-4 bg-[#F3F4F0] rounded-2xl"><img src={secure} alt="безопасность" className="w-8 h-8" /></div>}
            title="Безопасная оплата"
            desc="100% защищенный платеж"
          />
          <SubFooter
            icon={<div className="p-4 bg-[#F3F4F0] rounded-2xl"><img src={support} alt="поддержка" className="w-8 h-8" /></div>}
            title="Поддержка 24/7"
            desc="Всегда на связи с вами"
          />
        </div>
      </section>

      {/* About Section - Юля Зубкевич */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="/IMG_0254.PNG" 
                alt="Юля Зубкевич - косметик-эстетист" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-[#1B4B43] p-10 rounded-[30px] text-white max-w-xs hidden md:block">
              <p className="text-2xl font-serif italic mb-2">"Показать эстетическое омоложение без единого укола"</p>
              <p className="text-sm opacity-70">— Моя цель</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">Давайте знакомиться!</span>
              <h2 className="text-4xl lg:text-5xl font-medium text-[#1A1A1A] leading-tight">
                Юля <br />
                <span className="italic font-serif">Зубкевич</span>
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-lg leading-relaxed">
                Я косметик-эстетист с высшим спортивным образованием. Более 13 лет я дарю красоту и здоровье коже.
              </p>
              <p className="text-lg leading-relaxed">
                Я не предлагаю процедуры «на один раз», я не навязываю лишнее. Я предлагаю стратегии ухода и только то, что будет работать как актив, чтобы результат накапливался и усиливал вашу природную красоту.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Что я делаю профессионально:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#1A1A1A]">
                  <span className="text-[#D19D6B] text-xl mt-1">✅</span>
                  <div>
                    <p className="font-semibold">Массаж лица</p>
                    <p className="text-sm text-gray-600">Методика Сергея Щуревича — тяжелая артиллерия, которой я владею</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[#1A1A1A]">
                  <span className="text-[#D19D6B] text-xl mt-1">✅</span>
                  <div>
                    <p className="font-semibold">Подбор домашнего ухода</p>
                    <p className="text-sm text-gray-600">Составлю персональный маршрут ухода специально для вас</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Вы пришли по адресу, если:</h3>
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

            <p className="text-lg font-medium text-[#1B4B43]">
              Забота о сложном — моя задача и это просто!
            </p>

            <button className="px-10 py-4 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-black transition-all">
              Записаться к Юле
            </button>
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