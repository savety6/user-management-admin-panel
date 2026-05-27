import { Navigate, createBrowserRouter } from 'react-router-dom'
import UsersPage from '@/features/users/UsersPage'
import V0App from '@/versions/v0/V0App'
import V0PlaceholderPage from '@/versions/v0/V0PlaceholderPage'
import V1App from '@/versions/v1/V1App'
import V1EmptyState from '@/versions/v1/components/V1EmptyState'
import V1UsersPage from '@/versions/v1/pages/V1UsersPage'
import V2App from '@/versions/v2/V2App'
import V2EmptyState from '@/versions/v2/components/V2EmptyState'
import V2UsersPage from '@/versions/v2/pages/V2UsersPage'

function createV0Routes() {
  return [
    { index: true, element: <UsersPage /> },
    { path: 'users', element: <UsersPage /> },
    {
      path: 'dashboard',
      element: (
        <V0PlaceholderPage title="Overview" description="Dashboard metrics coming soon." />
      ),
    },
    {
      path: 'teams',
      element: <V0PlaceholderPage title="Teams" description="Team management coming soon." />,
    },
    {
      path: 'roles',
      element: (
        <V0PlaceholderPage
          title="Roles & Permissions"
          description="Role management coming soon."
        />
      ),
    },
    {
      path: 'audit',
      element: <V0PlaceholderPage title="Audit Log" description="Activity log coming soon." />,
    },
    {
      path: 'settings',
      element: <V0PlaceholderPage title="Settings" description="System settings coming soon." />,
    },
  ]
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <V0App basePath="" />,
    children: createV0Routes(),
  },
  {
    path: '/v0',
    element: <V0App basePath="/v0" />,
    children: createV0Routes(),
  },
  {
    path: '/v1',
    element: <V1App />,
    children: [
      { index: true, element: <Navigate to="/v1/users" replace /> },
      { path: 'users', element: <V1UsersPage /> },
      { path: 'dashboard', element: <V1EmptyState /> },
      { path: 'teams', element: <V1EmptyState /> },
      { path: 'roles', element: <V1EmptyState /> },
      { path: 'audit', element: <V1EmptyState /> },
      { path: 'settings', element: <V1EmptyState /> },
      { path: '*', element: <V1EmptyState /> },
    ],
  },
  {
    path: '/v2',
    element: <V2App />,
    children: [
      { index: true, element: <Navigate to="/v2/users" replace /> },
      { path: 'users', element: <V2UsersPage /> },
      { path: 'dashboard', element: <V2EmptyState /> },
      { path: 'teams', element: <V2EmptyState /> },
      { path: 'roles', element: <V2EmptyState /> },
      { path: 'audit', element: <V2EmptyState /> },
      { path: 'settings', element: <V2EmptyState /> },
      { path: '*', element: <V2EmptyState /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
