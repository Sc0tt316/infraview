
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// CookieConsent component removed

// Set cookie consent as accepted automatically
import { setCookie } from './lib/cookie';

// Set the cookie consent as accepted by default
setCookie('cookie-consent', 'accepted', 365); // Valid for 1 year

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <>
    <App />
  </>
);
