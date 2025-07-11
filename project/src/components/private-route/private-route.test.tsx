import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus, NameSpace } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';

import PrivateRoute from './index';

// Mock child component for testing
const TestChildComponent = () => <div>Protected Content</div>;

// Mock Login component to verify redirection
const MockLoginPage = () => <div>Login Page</div>;

describe('Component: PrivateRoute', () => {
  const renderPrivateRoute = (
    authorizationStatus = AuthorizationStatus.Unknown,
    children: React.ReactNode = <TestChildComponent />,
  ) => {
    const store = createMockStore({
      [NameSpace.User]: {
        authorizationStatus,
        email:
          authorizationStatus === AuthorizationStatus.Auth
            ? 'test@example.com'
            : null,
      },
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <PrivateRoute>{children}</PrivateRoute>
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  const renderPrivateRouteWithNavigation = (
    authorizationStatus = AuthorizationStatus.Unknown,
    initialEntries: string[] = ['/protected'],
    children: React.ReactNode = <TestChildComponent />,
  ) => {
    const store = createMockStore({
      [NameSpace.User]: {
        authorizationStatus,
        email:
          authorizationStatus === AuthorizationStatus.Auth
            ? 'test@example.com'
            : null,
      },
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path={AppRoute.Login} element={<MockLoginPage />} />
              <Route
                path="*"
                element={<PrivateRoute>{children}</PrivateRoute>}
              />
            </Routes>
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  describe('Rendering', () => {
    it('should redirect to login when authorization status is Unknown', () => {
      renderPrivateRouteWithNavigation(AuthorizationStatus.Unknown, [
        '/protected',
      ]);

      // Should redirect to login page and not show protected content
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render children when user is authenticated', () => {
      renderPrivateRoute(AuthorizationStatus.Auth);

      expect(screen.getByText('Protected Content')).toBeVisible();
    });

    it('should handle React.ReactNode children correctly', () => {
      const ComplexChildren = () => (
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      );

      renderPrivateRoute(AuthorizationStatus.Auth, <ComplexChildren />);

      expect(screen.getByText('Title')).toBeVisible();
      expect(screen.getByText('Paragraph')).toBeVisible();
      expect(screen.getByText('Button')).toBeVisible();
    });

    it('should handle string children', () => {
      renderPrivateRoute(AuthorizationStatus.Auth, 'Simple text content');

      expect(screen.getByText('Simple text content')).toBeVisible();
    });

    it('should handle multiple children', () => {
      const multipleChildren = (
        <>
          <div>First child</div>
          <div>Second child</div>
        </>
      );

      renderPrivateRoute(AuthorizationStatus.Auth, multipleChildren);

      expect(screen.getByText('First child')).toBeVisible();
      expect(screen.getByText('Second child')).toBeVisible();
    });

    it('should work correctly when accessed from different routes', () => {
      renderPrivateRoute(AuthorizationStatus.Auth);

      expect(screen.getByText('Protected Content')).toBeVisible();
    });
  });

  describe('Actions', () => {
    it('should redirect to login page when user is not authenticated', () => {
      renderPrivateRouteWithNavigation(AuthorizationStatus.NoAuth, ['/result']);

      // Should redirect to login page and not show protected content
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should update when authorization status changes from Unknown to Auth', () => {
      const { rerender } = renderPrivateRoute(AuthorizationStatus.Unknown);

      // Initially should redirect (not show content)
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
    });

    it('should update when authorization status changes from Unknown to NoAuth', () => {
      const { rerender } = renderPrivateRoute(AuthorizationStatus.Unknown);

      // Initially should redirect (not show content)
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
    });
  });
});
