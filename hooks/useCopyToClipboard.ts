// Inspired on https://github.com/uidotdev/usehooks/blob/main/index.js#L133:L164
// Improved with Claude 3

/**
 * A React hook for copying text to the clipboard.
 *
 * This hook provides a modern and performant way of copying text to the clipboard
 * using the `navigator.clipboard.writeText` API. It falls back to a legacy method
 * using a temporary `<textarea>` element if the modern API is not supported.
 *
 * @returns An object containing the last copied value and a function for copying text to the clipboard.
 *
 * @example
 * const { state, copyToClipboard } = useCopyToClipboard();
 *
 * // Usage
 * copyToClipboard('Hello, World!');
 * console.log(state); // Output: 'Hello, World!'
 */

import { useCallback, useState } from 'react';

function oldSchoolCopy(text: string) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
}

export default function useCopyToClipboard() {
  const [state, setState] = useState<string | null>(null);

  const copyToClipboard = useCallback((value: string) => {
    const handleCopy = async () => {
      try {
        // Check if the modern clipboard API is supported
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          setState(value);
        } else {
          throw new Error('writeText not supported');
        }
      } catch (e) {
        // Fallback to the legacy method if the modern API is not supported
        oldSchoolCopy(value);
        setState(value);
      }
    };

    // Invoke the handleCopy function immediately
    handleCopy();
  }, []);

  return { state, copyToClipboard };
}
