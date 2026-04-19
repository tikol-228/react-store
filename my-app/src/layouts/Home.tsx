import Header from '../components/Header'
import SubFooter from '../components/SubFooter'
import plane from '../icons/plane.svg'
import returnIcon from '../icons/returnIcon.svg'
import secure from '../icons/secure.svg'
import support from '../icons/support.svg'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import ProductsGrid from '../components/ProductsGrid'

const Home = () => {
  return (
    <>
      <Header />
      <Banner/>
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <SubFooter
            icon={<img src={plane} alt="самолёт" className="w-12 h-12" />}
            title="БЕСПЛАТНАЯ ДОСТАВКА"
            desc="Бесплатная доставка на все заказы"
          />

          <SubFooter
            icon={<img src={returnIcon} alt="возврат" className="w-12 h-12" />}
            title="БЕСПЛАТНЫЙ ВОЗВРАТ"
            desc="Политика возврата в течение 30 дней"
          />

          <SubFooter
            icon={<img src={secure} alt="безопасность" className="w-12 h-12" />}
            title="БЕЗОПАСНАЯ ОПЛАТА"
            desc="100% безопасная оплата"
          />

          <SubFooter
            icon={<img src={support} alt="поддержка" className="w-12 h-12" />}
            title="ПОДДЕРЖКА 24/7"
            desc="Круглосуточная поддержка"
          />

        </div>
      </section>
      <ProductsGrid/>
       <Footer/>
    </>
  )
}

export default Home