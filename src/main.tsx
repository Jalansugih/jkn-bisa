// Ensure window.fetch is writable if running in sandboxed environment with getter-only fetch
try {
  const originalFetch = window.fetch ? window.fetch.bind(window) : undefined;
  let activeFetch = originalFetch;
  Object.defineProperty(window, 'fetch', {
    get: () => activeFetch,
    set: (fn) => {
      activeFetch = fn;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
