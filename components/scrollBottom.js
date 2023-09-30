import React, { useState, useEffect } from 'react';

const ScrollButton =() => {
  const [isBottom, setIsBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Function to check if user is at the bottom of the page
  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
    setIsBottom(bottom);
    
    // Make button visible only when user has scrolled a bit
    setIsVisible(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToPosition = () => {
    if (isBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
    onClick={scrollToPosition}
    className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full focus:outline-none hover:bg-blue-700 transition-colors"
  >
      Button
    </button>
  );
}

export default ScrollButton;
