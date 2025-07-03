import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@components/logo/logo';
import { AppRoute } from '@settings';

import './not-found.css';

const NotFoundPage: React.FC = () => (
  <section className="game">
    <header className="game__header">
      <Logo />
    </header>
    <main className="game__screen not-found">
      <h1 className="not-found__title">404</h1>
      <h2 className="not-found__subtitle">Page not found</h2>
      <p className="not-found__description">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link className="link" to={AppRoute.Root}>
        Go back to the main page
      </Link>
    </main>
  </section>
);

export default NotFoundPage;
