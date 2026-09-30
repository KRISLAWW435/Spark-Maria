// Polyfill / safety patch for environments where window.fetch is getter-only
(function patchWindowFetch() {
  try {
    let currentFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : undefined;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'fetch');
    if (desc && !desc.writable && !desc.set) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(v) {
          currentFetch = v;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // ignore if sealed
  }
})();

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
