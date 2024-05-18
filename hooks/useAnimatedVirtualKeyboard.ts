// Based on: https://github.com/Temzasse/react-modal-sheet/blob/main/example/components/AvoidKeyboard.tsx

import { useEffect, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

function useVirtualKeyboard() {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (visualViewport) {
      const onResize = () => {
        const focusedElement = document.activeElement as HTMLElement | null;

        // Bail if no element is focused as that also means no input is focused
        if (!focusedElement) return;

        const isInputFocused =
          focusedElement.tagName === 'INPUT' ||
          focusedElement.tagName === 'TEXTAREA';

        // Virtual keyboard should only be visible if an input is focused
        if (isInputFocused && visualViewport.height < window.innerHeight) {
          setKeyboardOpen(true);
          setKeyboardHeight(window.innerHeight - visualViewport.height);
        } else if (isKeyboardOpen) {
          // Reset keyboard height if it was open
          setKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      };

      visualViewport.addEventListener('resize', onResize);

      return () => {
        visualViewport.removeEventListener('resize', onResize);
      };
    }
  }, [isKeyboardOpen]);

  return { keyboardHeight, isKeyboardOpen };
}

export default function useAnimatedVirtualKeyboard() {
  const { isKeyboardOpen, keyboardHeight } = useVirtualKeyboard();
  const animatedKeyboardHeight = useMotionValue(keyboardHeight);

  useEffect(() => {
    if (isKeyboardOpen) {
      void animate(animatedKeyboardHeight, keyboardHeight);
    } else {
      void animate(animatedKeyboardHeight, 0);
    }
  }, [isKeyboardOpen, keyboardHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  return { keyboardHeight: animatedKeyboardHeight, isKeyboardOpen };
}
