import { careTypeAbbreviation, careTypesLabel } from '../data/productCareTypes';

type CareTypeBadgeProps = {
  careType?: string | null;
  className?: string;
};

const CareTypeBadge: React.FC<CareTypeBadgeProps> = ({ careType, className = '' }) => {
  const abbr = careTypeAbbreviation(careType);
  if (!abbr) return null;

  const title = careTypesLabel(careType);

  return (
    <span
      title={title}
      aria-label={`Тип ухода: ${title}`}
      className={`inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[#1B4B43] px-1.5 text-[11px] font-bold leading-none tracking-tight text-white shadow-md ${className}`}
    >
      {abbr}
    </span>
  );
};

export default CareTypeBadge;
