import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import {configureMockStore} from '@jedmao/redux-mock-store';

import Mistakes from './mistakes';

const mockStore = configureMockStore();

describe('component/mistakes', () => {
  const mistakeContainerTestId = 'mistake-container';
  const mistakeValueTestId = 'mistake-value';
  it('should render 3 mistakes', () => {
    const expectedCount = 3;

    render(
      <Provider store={mockStore({mistakesCount: 3})}>
        <MemoryRouter>
          <Mistakes />
        </MemoryRouter>
      </Provider>
    );

    const mistakesContainer = screen.getByTestId(mistakeContainerTestId);
    const mistakeValues = screen.getAllByTestId(mistakeValueTestId);
    expect(mistakesContainer).toBeVisible();
    expect(mistakeValues.length).toBe(expectedCount);
  });

  it('should not render mistakes', () => {
    render(
      <Provider store={mockStore({mistakesCount: 0})}>
        <MemoryRouter>
          <Mistakes />
        </MemoryRouter>
      </Provider>
    );

    const mistakesContainer = screen.queryByTestId(mistakeContainerTestId);
    expect(mistakesContainer).toBeNull();

  })
});
