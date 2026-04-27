import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { trackPageView } from './analytics.js';
import { applyLandingOgAbsolute, injectJsonLdLanding } from './seo.js';

injectJsonLdLanding();
applyLandingOgAbsolute();
trackPageView(window.location.pathname + window.location.search);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

