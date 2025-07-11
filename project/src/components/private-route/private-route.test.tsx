import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute, AuthorizationStatus, NameSpace } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';

import PrivateRoute from './index';

// Mock child component for testing
const TestChildComponent = () => <div>Protected Content</div>;

describe('Component: PrivateRoute', () => {
  const renderPrivateRoute = (
    authorizationStatus = AuthorizationStatus.Unknown,
  ) => {
    const store = createMockStore({
      [NameSpace.User]: {
        authorizationStatus,
        email: null,
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <PrivateRoute>
            <TestChildComponent />
          </PrivateRoute>
        </MemoryRouter>
      </Provider>,
    );
  };

  describe('Rendering', () => {
    it('should redirect to login when authorization status is Unknown', () => {
      renderPrivateRoute(AuthorizationStatus.Unknown);

      // Should not render the protected content or loader
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should render children when user is authenticated', () => {
      renderPrivateRoute(AuthorizationStatus.Auth);

      expect(screen.getByText('Protected Content')).toBeVisible();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should handle React.ReactNode children correctly', () => {
      const ComplexChildren = () => (
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      );

      const store = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PrivateRoute>
              <ComplexChildren />
            </PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.getByText('Title')).toBeVisible();
      expect(screen.getByText('Paragraph')).toBeVisible();
      expect(screen.getByText('Button')).toBeVisible();
    });

    it('should handle string children', () => {
      const store = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PrivateRoute>Simple text content</PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.getByText('Simple text content')).toBeVisible();
    });

    it('should handle multiple children', () => {
      const store = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PrivateRoute>
              <div>First child</div>
              <div>Second child</div>
            </PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.getByText('First child')).toBeVisible();
      expect(screen.getByText('Second child')).toBeVisible();
    });

    it('should work correctly when accessed from different routes', () => {
      const store = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[AppRoute.Result]}>
            <PrivateRoute>
              <TestChildComponent />
            </PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.getByText('Protected Content')).toBeVisible();
    });
  });

  describe('Actions', () => {
    it('should redirect to login page when user is not authenticated', () => {
      const store = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          email: null,
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/result']}>
            <PrivateRoute>
              <TestChildComponent />
            </PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      // Should not render the protected content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should update when authorization status changes from Unknown to Auth', () => {
      const { rerender } = renderPrivateRoute(AuthorizationStatus.Unknown);

      // Initially should redirect (not show loader or content)
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

      // Re-render with authenticated status
      const storeAuth = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      rerender(
        <Provider store={storeAuth}>
          <MemoryRouter>
            <PrivateRoute>
              <TestChildComponent />
            </PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.getByText('Protected Content')).toBeVisible();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should update when authorization status changes from Unknown to NoAuth', () => {
      const { rerender } = renderPrivateRoute(AuthorizationStatus.Unknown);

      // Initially should redirect (not show loader or content)
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

      // Re-render with no auth status
      const storeNoAuth = createMockStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          email: null,
        },
      });

      rerender(
        <Provider store={storeNoAuth}>
          <MemoryRouter>
            <PrivateRoute>
              <TestChildComponent />
            </PrivateRoute>
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
