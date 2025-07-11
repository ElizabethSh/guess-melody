import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createMockStore } from '@test-utils/mock-store';
import { render } from '@testing-library/react';

import PageHeader from './index';

describe('PageHeader Component', () => {
  const renderPageHeader = () => {
    const store = createMockStore();
    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <PageHeader />
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  describe('Rendering', () => {
    it('should render header with logo and timer components', () => {
      const { container } = renderPageHeader();

      // Header element with correct class
      const header = container.querySelector('header.game__header');
      expect(header).toBeVisible();

      // Logo component
      const logo = container.querySelector('.game__logo');
      expect(logo).toBeVisible();
      expect(container.querySelector('.game__back')).toBeInTheDocument();

      // Timer circle SVG
      const timer = container.querySelector('.timer');
      expect(timer).toBeVisible();

      // Circle element inside SVG
      const circle = container.querySelector('.timer__line');
      expect(circle).toBeInTheDocument();
    });
  });
});
