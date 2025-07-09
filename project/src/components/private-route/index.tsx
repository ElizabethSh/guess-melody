import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/use-store';
import { AppRoute, AuthorizationStatus } from '@settings';
import { selectAuthorizationStatus } from '@store/slices/user/user';

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  return authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to={AppRoute.Login} />
  );
};

export default PrivateRoute;
