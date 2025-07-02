import React from 'react';

import Logo from '../../../components/logo/logo';
import Mistakes from '../../../components/mistakes/mistakes';
import { circle } from '../../../icons';

const PageHeader: React.FC = () => (
  <header className="game__header">
    <Logo />
    {circle}
    <Mistakes />
  </header>
);

export default PageHeader;
