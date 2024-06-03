// Inspired on https://github.com/Temzasse/react-modal-sheet/blob/main/example/components/AvoidKeyboard.tsx
// Code assisted by Claude 3 Sonnet, an AI assistant created by Anthropic.

import { useCallback, useEffect, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

// Hook to detect virtual keyboard visibility and height on mobile devices
function useVirtualKeyboard() {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Memoize the event listener callback to improve performance
  const handleResize = useCallback(() => {
    // Check if the window object exists to prevent runtime errors
    if (!window) return;

    const visualViewport = window.visualViewport;
    const focusedElement = document.activeElement;

    // Type guard to ensure focusedElement is an HTMLElement or null
    if (!focusedElement || !(focusedElement instanceof HTMLElement)) return;

    const isInputFocused =
      focusedElement.tagName === 'INPUT' ||
      focusedElement.tagName === 'TEXTAREA';

    // Virtual keyboard should only be visible if an input is focused
    if (
      isInputFocused &&
      visualViewport &&
      visualViewport.height < window.innerHeight
    ) {
      setKeyboardOpen(true);
      setKeyboardHeight(window.innerHeight - visualViewport.height);
    } else if (isKeyboardOpen) {
      // Reset keyboard height if it was open
      setKeyboardOpen(false);
      setKeyboardHeight(0);
    }
  }, [isKeyboardOpen]);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);

      // Cleanup function to remove the event listener
      return () => {
        visualViewport.removeEventListener('resize', handleResize);
      };
    }
  }, [handleResize]);

  return { keyboardHeight, isKeyboardOpen };
}

// Hook to animate the virtual keyboard height
export default function useAnimatedVirtualKeyboard() {
  const { isKeyboardOpen, keyboardHeight } = useVirtualKeyboard();
  const animatedKeyboardHeight = useMotionValue(keyboardHeight);

  useEffect(() => {
    if (isKeyboardOpen) {
      void animate(animatedKeyboardHeight, keyboardHeight);
    } else {
      void animate(animatedKeyboardHeight, 0);
    }
  }, [isKeyboardOpen, keyboardHeight, animatedKeyboardHeight]);

  return { keyboardHeight: animatedKeyboardHeight, isKeyboardOpen };
}
