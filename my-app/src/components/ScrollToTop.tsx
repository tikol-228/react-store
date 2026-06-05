import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** При смене страницы — прокрутка вверх; при hash — к якорю на странице. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, '');
      let attempts = 0;
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        attempts += 1;
        if (attempts < 25) {
          requestAnimationFrame(scrollToHash);
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      };
      scrollToHash();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
