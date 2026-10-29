import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { warmUpPianoSamples } from './domain/audio';
import './index.css';

warmUpPianoSamples();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        reg.update().catch(() => {});
      })
      .catch(() => {
        // Service worker registration is progressive enhancement
      });
  });
}
