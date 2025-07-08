import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logo } from '@icons';
import { AppRoute } from '@settings';

import './logo.css';

type LogoProps = {
  variant?: 'primary' | 'secondary';
};

const Logo: React.FC<LogoProps> = ({ variant = 'primary' }) => {
  const { pathname } = useLocation();

  if (pathname === AppRoute.Root) {
    return logo;
  }

  return (
    <Link className="game__back" to={AppRoute.Root}>
      <span className="visually-hidden">Play again</span>
      <div className={variant}>{logo}</div>
    </Link>
  );
};

export default Logo;
