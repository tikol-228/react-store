import { Link, Navigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { infoPages, type InfoPageSlug } from '../data/infoPages';
import { ArrowLeft, CreditCard, Truck, RotateCcw } from 'lucide-react';

const icons: Record<InfoPageSlug, typeof CreditCard> = {
  payment: CreditCard,
  delivery: Truck,
  returns: RotateCcw,
};

const pathToSlug: Record<string, InfoPageSlug> = {
  '/payment': 'payment',
  '/delivery': 'delivery',
  '/returns': 'returns',
};

const InfoPage = () => {
  const { pathname } = useLocation();
  const key = pathToSlug[pathname];
  const page = key ? infoPages[key] : undefined;

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const Icon = icons[page.slug];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1B4B43] mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          На главную
        </Link>

        <div className="flex items-start gap-4 mb-10">
          <div className="p-4 bg-[#1B4B43]/10 rounded-2xl text-[#1B4B43] shrink-0">
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">{page.title}</h1>
            <p className="text-gray-600">{page.subtitle}</p>
          </div>
        </div>

        <div className="space-y-8">
          {page.sections.map((section) => (
            <section
              key={section.heading}
              className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="text-gray-600 leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Остались вопросы?{' '}
          <Link to="/contacts" className="text-[#1B4B43] font-semibold hover:underline">
            Свяжитесь с нами
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default InfoPage;
