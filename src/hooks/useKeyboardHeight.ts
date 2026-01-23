import { useState, useEffect } from 'react';

/**
 * Detects iOS virtual keyboard height using Visual Viewport API
 * Returns keyboard height in pixels (0 when keyboard is hidden)
 */
export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Only run on mobile devices with Visual Viewport API
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      // When keyboard appears, visual viewport height < window.innerHeight
      const viewport = window.visualViewport!;
      const keyboardHeight = window.innerHeight - viewport.height;

      // Only set if keyboard is showing (threshold: 150px)
      // Avoids false positives from address bar hiding
      setKeyboardHeight(keyboardHeight > 150 ? keyboardHeight : 0);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);

    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return keyboardHeight;
}
