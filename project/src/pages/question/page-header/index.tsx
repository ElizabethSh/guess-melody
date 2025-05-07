import React from 'react';
import Logo from '../../../components/logo/logo';
import { circle } from '../../../icons';
import Mistakes from '../../../components/mistakes/mistakes';

const PageHeader: React.FC = () => (
  <header className="game__header">
    <Logo />
    {circle}
    <Mistakes />
  </header>
);

export default PageHeader;
