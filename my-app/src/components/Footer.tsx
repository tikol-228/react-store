import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/company';
import { footerSections } from '../data/footerLinks';
import FooterLinkItem from './FooterLinkItem';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-black mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.label}`}>
                  <FooterLinkItem item={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Контакты</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
            <li className="font-semibold text-black/90">{companyInfo.name}</li>
            <li>
              <a href={`tel:${companyInfo.phone}`} className="hover:text-black transition-colors">
                {companyInfo.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${companyInfo.emails.primary}`}
                className="hover:text-black text-[10px] sm:text-xs transition-colors break-all"
              >
                {companyInfo.emails.primary}
              </a>
            </li>
            <li>
              <Link to="/contacts" className="hover:text-black transition-colors">
                Страница контактов
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/10 mt-6 sm:mt-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="text-xs sm:text-sm text-black/70">
              <p className="font-semibold text-black mb-1 sm:mb-2">Адрес:</p>
              <p className="text-xs sm:text-sm">{companyInfo.address.city}</p>
              <p className="text-xs sm:text-sm">{companyInfo.address.street}</p>
              <p className="text-xs sm:text-sm">{companyInfo.address.floor}</p>
            </div>

            <div className="text-xs sm:text-sm text-black/70">
              <p className="font-semibold text-black mb-1 sm:mb-2">Время работы:</p>
              <p className="text-xs sm:text-sm">{companyInfo.workingHours.weekday}</p>
              <p className="text-xs sm:text-sm">{companyInfo.workingHours.saturday}</p>
              <p>{companyInfo.workingHours.sunday}</p>
            </div>

            <div className="text-sm text-black/70">
              <p className="font-semibold text-black mb-2">Банковские реквизиты:</p>
              <p>{companyInfo.bankDetails.bank}</p>
              <p className="break-all">{companyInfo.bankDetails.accountNumber}</p>
              <p>BIC: {companyInfo.bankDetails.bic}</p>
              <p className="mt-2 text-xs">УНП {companyInfo.taxNumber}</p>
            </div>
          </div>

          <div className="border-t border-black/10 pt-6 text-sm text-black/60 flex flex-col md:flex-row items-center justify-between gap-2">
            <p>© Все права защищены.</p>
            <p>Сделано Tikol</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
