import type { MouseEvent, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection, setProductCategoryFilter } from '../utils/scrollToSection';

type FooterScrollLinkProps = {
  children: ReactNode;
  section: string;
  category?: string;
  className?: string;
};

const FooterScrollLink = ({ children, section, category, className }: FooterScrollLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(section, 'smooth', category);
      window.history.replaceState(null, '', `#${section}`);
      return;
    }
    if (category) {
      setProductCategoryFilter(category);
    }
    navigate(`/#${section}`);
  };

  return (
    <a href={`/#${section}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default FooterScrollLink;
