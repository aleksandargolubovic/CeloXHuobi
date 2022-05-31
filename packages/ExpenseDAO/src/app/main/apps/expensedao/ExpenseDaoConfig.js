import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ChooseOption = lazy(() => import('./organization-setup/ChooseOption'));
const NewOrganization = lazy(() => import('./organization-setup/NewOrganization'));
const OrganizationDashboard = lazy(() => import('./organization-dashboard/OrganizationDashboard'));
const Request = lazy(() => import('./request-management/request/Request'));
const Requests = lazy(() => import('./request-management/requests/Requests'));
const NewRequest = lazy(() => import('./request-management/new-request/NewRequest'));



const ExpenseDaoConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/expensedao/organizations/choose',
      element: <ChooseOption />,
    },
    {
        path: 'apps/expensedao/organizations/new',
        element: <NewOrganization />,
      },

    {
      path: 'apps/expensedao/organizations',
      element: <Navigate to="/apps/expensedao/organizations/choose" />,
    },
    {
      path: 'apps/expensedao/organization',
      element: <OrganizationDashboard />,
    },
    {
      path: 'apps/expensedao/requests',
      element: <Requests />,
    },
    {
      path: 'apps/expensedao/requests/:organizationId/:requestId',
      element: <Request />,
    },
    {
      path: 'apps/expensedao/request/new',
      element: <NewRequest />,
    },

  ],
};

export default ExpenseDaoConfig;
