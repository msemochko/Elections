import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import 'rsuite/dist/styles/rsuite-default.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/react';
import ReportError from './components/ReportError';

// Returns true in development.
const dev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// Google Analytics
if (!process.env.REACT_APP_GA_KEY)
  console.error("Please redeoploy the app with a valid google analytics key.");
ReactGA.initialize(process.env.REACT_APP_GA_KEY || "", {
  debug: dev,
  gaOptions: {
    cookieDomain: 'auto',
  },
});

// Sentry for Error Reporting
if (!process.env.REACT_APP_SENTRY_KEY)
  console.error("Please redeoploy the app with a valid sentry key.");
Sentry.init({
  debug: dev,
  environment: dev ? 'development' : 'production',
  release: 'democracy@0.1.0',
  dsn: process.env.REACT_APP_SENTRY_KEY || "",
});


ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Sentry.ErrorBoundary fallback={<ReportError />}>
        <App />
      </Sentry.ErrorBoundary>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(// console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
