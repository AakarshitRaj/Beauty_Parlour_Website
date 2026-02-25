import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on every route change
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
};

export default ScrollToTop;
