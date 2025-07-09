import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '@icons';
import { AppRoute } from '@settings';

import './logo.css';

type LogoProps = {
  variant?: 'primary' | 'secondary';
};

const Logo: React.FC<LogoProps> = ({ variant = 'primary' }) => (
  <Link className="game__back" to={AppRoute.Root}>
    <span className="visually-hidden">Play again</span>
    <div className={`logo-${variant}`}>{logo}</div>
  </Link>
);

export default Logo;
