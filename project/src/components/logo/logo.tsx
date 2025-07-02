import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppRoute } from '../../settings';
import { logo } from '../../icons';

import './logo.css';

const Logo: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname === AppRoute.Root) {
    return logo;
  }

  return (
    <Link className="game__back" to={AppRoute.Root}>
      <span className="visually-hidden">Play again</span>
      {logo}
    </Link>
  );
};

export default Logo;
