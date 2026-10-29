import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('isVisible');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1, 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

export default useScrollAnimation;