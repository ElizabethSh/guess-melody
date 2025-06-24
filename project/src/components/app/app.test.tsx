import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import App from './app';
import { AuthorizationStatus } from '../../settings';

const mockStore = configureMockStore();

describe('App component', () => {
  it('should render loader when autorisation status is unknown', () => {
    const store = mockStore({
      USER: { authorizationStatus: AuthorizationStatus.Unknown },
      DATA: { isLoadingData: false, isError: false },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Loading...')).toBeVisible();
  });
  it('should render loader when data is loading', () => {
    const store = mockStore({
      USER: { authorizationStatus: AuthorizationStatus.Auth },
      DATA: { isLoadingData: true, isError: false },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Loading...')).toBeVisible();
  });
  it('should render error page', () => {
    const store = mockStore({
      USER: { authorizationStatus: AuthorizationStatus.Auth },
      DATA: { isLoadingData: false, isError: true },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByRole('heading', { name: 'Error' })).toBeVisible();
  });
});
