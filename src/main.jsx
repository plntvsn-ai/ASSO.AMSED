import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Service Worker with auto-update
if ('serviceWorker' in navigator && (import.meta.env.PROD || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.update();
    }).catch(() => {});
  });
}
