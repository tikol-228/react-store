import { Link } from 'react-router-dom';
import type { FooterLinkItem as FooterLinkConfig } from '../data/footerLinks';
import FooterScrollLink from './FooterScrollLink';

const linkClass = 'hover:text-black transition-colors';

type Props = {
  item: FooterLinkConfig;
};

const FooterLinkItem = ({ item }: Props) => {
  if (item.type === 'route') {
    return (
      <Link to={item.to} className={linkClass}>
        {item.label}
      </Link>
    );
  }
  if (item.type === 'scroll') {
    return (
      <FooterScrollLink section={item.section} category={item.category} className={linkClass}>
        {item.label}
      </FooterScrollLink>
    );
  }
  return (
    <a href={item.href} className={linkClass} target="_blank" rel="noopener noreferrer">
      {item.label}
    </a>
  );
};

export default FooterLinkItem;
