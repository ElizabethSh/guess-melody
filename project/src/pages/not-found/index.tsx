import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@components/layout';
import { AppRoute } from '@settings';

import './not-found.css';

const NotFoundPage: React.FC = () => (
  <Layout className="not-found">
    <h1 className="not-found__title">404</h1>
    <h2 className="main__title">Page not found</h2>
    <p className="not-found__description">
      Sorry, the page you are looking for doesn’t exist or has been moved.
    </p>
    <Link className="link not-found__link" to={AppRoute.Root}>
      Go back to the main page
    </Link>
  </Layout>
);

export default NotFoundPage;
