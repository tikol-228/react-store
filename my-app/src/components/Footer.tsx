import React from 'react';
import { companyInfo, TELEGRAM_URL, INSTAGRAM_URL } from '../data/company';
import { footerLegalLinks, footerClientLinks } from '../data/footerLinks';
import FooterLinkItem from './FooterLinkItem';

const linkListClass = 'space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70';
const headingClass = 'font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-black';
const inlineLinkClass = 'hover:text-black transition-colors';
const socialLinkClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110 hover:bg-black/5';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <defs>
      <linearGradient id="footer-instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FEDA75" />
        <stop offset="25%" stopColor="#FA7E1E" />
        <stop offset="50%" stopColor="#D62976" />
        <stop offset="75%" stopColor="#962FBF" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <path
      fill="url(#footer-instagram-gradient)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
    />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <path
      fill="#26A5E4"
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
    />
  </svg>
);

const Footer: React.FC = () => {
  const { pickupAddress } = companyInfo;

  return (
    <footer className="w-full bg-white text-black mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* 1. Контактная информация */}
          <div>
            <h3 className={headingClass}>Контактная информация</h3>
            <ul className={linkListClass}>
              <li>
                <a href={`mailto:${companyInfo.emails.primary}`} className={`${inlineLinkClass} break-all`}>
                  {companyInfo.emails.primary}
                </a>
              </li>
              <li>
                <a href={`tel:${companyInfo.phoneTel}`} className={inlineLinkClass}>
                  {companyInfo.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="font-medium text-black/80">Адрес самовывоза:</span>
                <br />
                {pickupAddress.country}, {pickupAddress.city}
                <br />
                {pickupAddress.street}
              </li>
              <li>
                {companyInfo.workingHours.weekday}
                <br />
                {companyInfo.workingHours.saturday}
                <br />
                {companyInfo.workingHours.sunday}
              </li>
              <li className="flex items-center gap-2 pt-2">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* 2. Юридическая информация */}
          <div>
            <h3 className={headingClass}>Юридическая информация</h3>
            <div className="content-text space-y-2 text-xs sm:text-sm text-black/70 leading-relaxed">
              <p>{companyInfo.legal.name}</p>
              <p>{companyInfo.legal.unp}</p>
              <p>
                <span className="font-medium text-black/80">Юридический адрес:</span>{' '}
                {companyInfo.legal.legalAddress}
              </p>
              <p>{companyInfo.legal.registration}</p>
              <p>{companyInfo.legal.tradeRegistry}</p>
            </div>
            <ul className={`${linkListClass} mt-3 pt-3 border-t border-black/10`}>
              {footerLegalLinks.map((link) => (
                <li key={link.label}>
                  <FooterLinkItem item={link} />
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Информация для клиента */}
          <div>
            <h3 className={headingClass}>Информация для клиента</h3>
            <ul className={linkListClass}>
              {footerClientLinks.map((link) => (
                <li key={link.label}>
                  <FooterLinkItem item={link} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 mt-8 sm:mt-10 pt-6 text-sm text-black/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© Все права защищены.</p>
          <p>Сделано Tikol</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
