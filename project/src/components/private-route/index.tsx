import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoute, AuthorizationStatus } from '../../settings';

type PrivateRouteProps = {
  authorizationStatus: AuthorizationStatus;
  children: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  authorizationStatus,
  children,
}) =>
  authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to={AppRoute.Login} />
  );

export default PrivateRoute;
