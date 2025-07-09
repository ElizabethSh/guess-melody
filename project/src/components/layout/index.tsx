import React from 'react';
import Logo from '@components/logo/logo';

import './layout.css';

type LayoutProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  children: React.ReactNode;
  showLogo?: boolean;
  authSection?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  authSection,
  showLogo = true,
  ...layoutProps
}) => (
  <section className="game">
    <header className="game__header">
      {showLogo && <Logo />}
      {authSection}
    </header>
    <main
      className={`game__screen ${className ? `${className}` : ''}`}
      {...layoutProps}
    >
      {children}
    </main>
  </section>
);

export default Layout;
