import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BookAppointmentButton from '../BookAppointmentButton';

type Breadcrumb = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type CatalogPageHeaderProps = {
  breadcrumbs: Breadcrumb[];
  title: string;
  description?: string;
};

const CatalogPageHeader = ({ breadcrumbs, title, description }: CatalogPageHeaderProps) => (
  <div className="mb-8 sm:mb-10">
    <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-6" aria-label="Хлебные крошки">
      {breadcrumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
          {crumb.href ? (
            <Link to={crumb.href} className="hover:text-[#1B4B43] transition-colors">
              {crumb.label}
            </Link>
          ) : crumb.onClick ? (
            <button
              type="button"
              onClick={crumb.onClick}
              className="hover:text-[#1B4B43] transition-colors text-left"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-[#1A1A1A] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>

    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center uppercase tracking-wide mb-8">
      {title}
    </h1>

    {description && (
      <div className="bg-[#F3F4F0] border border-[#1B4B43]/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
        <img
          src="/IMG_0254.PNG"
          alt="Консультант по подбору косметики"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
        />
        <div className="content-text flex-1 min-w-0">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{description}</p>
          <BookAppointmentButton className="mt-4 inline-block text-sm font-semibold text-[#1B4B43] hover:text-[#2a6b5f] underline underline-offset-2">
            Подобрать косметику →
          </BookAppointmentButton>
        </div>
      </div>
    )}
  </div>
);

export default CatalogPageHeader;
