import { ComponentType, lazy } from 'react';

interface RouteInterface {
  path: string;
  component: ComponentType;
  isProtected?: boolean;
}

export const routes: RouteInterface[] = [
  {
    path: '/',
    component: lazy(() => import('../pages/HomePage')),
  },
  {
    path: '/login',
    component: lazy(() => import('../pages/LoginPage')),
  },
  {
    path: '/signup',
    component: lazy(() => import('../pages/SignUpPage')),
  },
  {
    path: '/dashboard',
    component: lazy(() => import('../pages/ProfilePage')),
  },
  {
    path: '/setting',
    component: lazy(() => import('../pages/SettingPage')),
  },
];
