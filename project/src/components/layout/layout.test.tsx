import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Layout from './index';

describe('Layout', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render children content', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>,
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should render logo by default', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(container.querySelector('.game__logo')).toBeInTheDocument();
  });

  it('should not render logo when showLogo is false', () => {
    const { container } = renderWithRouter(
      <Layout showLogo={false}>
        <div>Content</div>
      </Layout>,
    );

    expect(container.querySelector('.game__logo')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(container.querySelector('.game')).toBeInTheDocument();
    expect(container.querySelector('.game__header')).toBeInTheDocument();
    expect(container.querySelector('.game__screen')).toBeInTheDocument();
  });

  it('should apply additional className to main screen', () => {
    const { container } = renderWithRouter(
      <Layout className="custom-class">
        <div>Content</div>
      </Layout>,
    );

    expect(
      container.querySelector('.game__screen.custom-class'),
    ).toBeInTheDocument();
  });
});
