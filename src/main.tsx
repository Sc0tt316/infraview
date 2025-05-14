
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import CookieConsent from './components/common/CookieConsent'

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <>
    <App />
    <CookieConsent />
  </>
);
