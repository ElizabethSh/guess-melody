import React from 'react';
import Logo from '@components/logo/logo';

import './layout.css';

type LayoutProps = {
  children: React.ReactNode;
  showLogo?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, showLogo = true }) => (
  <section className="game">
    <header className="game__header">{showLogo && <Logo />}</header>
    <main className="game__screen">{children}</main>
  </section>
);

export default Layout;
