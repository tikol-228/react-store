import React from 'react';
import { Phone, Mail, MapPin, Clock, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingSection from '../components/BookingSection';
import { companyInfo } from '../data/company';

const Contacts: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3">Контакты</h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl text-justify-pretty">
            Свяжитесь с нами или оставьте заявку на персональный подбор косметики
          </p>
        </div>

        <div className="mb-14 sm:mb-20">
          <BookingSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="content-text space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <Building2 className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{companyInfo.name}</h3>
                  <p className="text-sm text-gray-600">{companyInfo.taxNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Адрес самовывоза</h3>
                <p className="text-gray-600">
                  {companyInfo.pickupAddress.country}, {companyInfo.pickupAddress.city}
                </p>
                <p className="text-gray-600">{companyInfo.pickupAddress.street}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                <a
                  href={`tel:${companyInfo.phoneTel}`}
                  className="text-[#1B4B43] hover:underline text-lg font-semibold"
                >
                  {companyInfo.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <div className="space-y-2">
                  <a
                    href={`mailto:${companyInfo.emails.primary}`}
                    className="block text-[#1B4B43] hover:underline"
                  >
                    {companyInfo.emails.primary}
                  </a>
                  <a
                    href={`mailto:${companyInfo.emails.secondary}`}
                    className="block text-[#1B4B43] hover:underline"
                  >
                    {companyInfo.emails.secondary}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Время работы</h3>
                <div className="space-y-1 text-gray-600">
                  <p>{companyInfo.workingHours.weekday}</p>
                  <p>{companyInfo.workingHours.saturday}</p>
                  <p>{companyInfo.workingHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="requisites"
            className="bg-gradient-to-br from-[#1B4B43] to-[#0f2f2a] text-white p-6 sm:p-8 rounded-2xl h-fit scroll-mt-28"
          >
            <h3 className="font-semibold text-2xl mb-6">Банковские реквизиты</h3>
            <div className="space-y-6">
              <div>
                <p className="text-white/70 text-sm mb-1">Банк</p>
                <p className="text-lg font-semibold">{companyInfo.bankDetails.bank}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Расчетный счет</p>
                <p className="text-lg font-mono break-all">{companyInfo.bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">BIC</p>
                <p className="text-lg font-mono">{companyInfo.bankDetails.bic}</p>
              </div>
              <div className="border-t border-white/20 pt-6">
                <p className="text-white/70 text-sm mb-1">УНП</p>
                <p className="text-lg font-semibold">{companyInfo.taxNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacts;
