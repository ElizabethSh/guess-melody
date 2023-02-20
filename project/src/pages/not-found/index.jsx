import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../components/logo/logo';

import { AppRoute } from '../../settings';

// TODO: create proper component
const NotFoundPage = () => (
  <section className='game'>
    <header className='game__header'>
      <Logo />
    </header>
    <main>
      <h1>Page not found</h1>
      <Link to={AppRoute.ROOT}>Вернуться на главную</Link>
    </main>
  </section>
);

export default NotFoundPage;
